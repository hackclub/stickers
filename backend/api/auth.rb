# frozen_string_literal: true

require 'faraday'
require 'json'

class Auth < Grape::API
  format :json
  helpers SessionHelpers

  namespace :auth do
    get :login do
      redirect '/auth/oidc'
    end

    get 'oidc/callback' do
      auth = env['omniauth.auth']
      user = User.find_or_create_from_oidc(auth)
      session[:user_id] = user.id
      redirect ENV.fetch('AUTH_SUCCESS_REDIRECT', '/')
    end

    get :logout do
      session.clear
      redirect ENV.fetch('AUTH_LOGOUT_REDIRECT', '/')
    end

    get :me do
      error!('Unauthorized', 401) unless current_user
      current_user
    end

    get 'hackatime/callback' do
      error!('Please log in first', 401) unless current_user

      auth = env['omniauth.auth']
      access_token = auth&.credentials&.token.to_s

      uid = nil
      if access_token.present?
        begin
          conn = Faraday.new(url: 'https://hackatime.hackclub.com')
          response = conn.get('/api/v1/authenticated/me') do |req|
            req.headers['Authorization'] = "Bearer #{access_token}"
            req.headers['Accept'] = 'application/json'
          end
          if response.success?
            body = JSON.parse(response.body) rescue {}
            uid = body['id'].to_s
          end
        rescue Faraday::Error => e
          error!("Hackatime API error: #{e.message}", 502)
        rescue StandardError => e
          error!("Unexpected error: #{e.message}", 500)
        end
      end

      error!('Could not determine Hackatime user. Try again.', 400) if uid.blank?

      session[:hackatime] = {
        uid: uid,
        access_token: access_token
      }

      redirect ENV.fetch('HACKATIME_SUCCESS_REDIRECT', '/')
    end

    get :hackatime do
      error!('Unauthorized', 401) unless current_user
      session[:hackatime] || {}
    end
  end
end
