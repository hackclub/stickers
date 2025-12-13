# frozen_string_literal: true

require 'dotenv'
Dotenv.load

require_relative 'boot'
require 'grape'
require 'rack/session'
require 'rack/cors'
require 'omniauth'
require 'omniauth_openid_connect'

use Rack::Cors do
  allow do
    origins ENV.fetch('FRONTEND_URL', 'http://localhost:5173')
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end

use Rack::Session::Cookie,
    key: 'stickers.session',
    secret: ENV.fetch('SESSION_SECRET'),
    same_site: :lax,
    expire_after: 86_400 * 7

OmniAuth.config.allowed_request_methods = %i[get post]

use OmniAuth::Builder do
  provider :openid_connect,
           name: :oidc,
           issuer: ENV.fetch('OIDC_ISSUER'),
           discovery: true,
           client_options: {
             identifier: ENV.fetch('OIDC_CLIENT_ID'),
             secret: ENV.fetch('OIDC_CLIENT_SECRET'),
             redirect_uri: ENV.fetch('OIDC_REDIRECT_URI'),
             host: 'auth.hackclub.com',
             scheme: 'https'
           },
           scope: %i[openid email profile name]
end

run lambda { |env|
  LOADER.reload
  App.call(env)
}
