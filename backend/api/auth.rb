# frozen_string_literal: true

class Auth < Grape::API
  format :json
  helpers SessionHelpers

  namespace :auth do
    get :login do
      redirect '/auth/oidc'
    end

    get 'oidc/callback' do
      auth = env['omniauth.auth']
      session[:user] = {
        id: auth.uid,
        email: auth.info.email,
        name: auth.info.name,
        slack_id: auth.info.slack_id
      }
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
  end
end
