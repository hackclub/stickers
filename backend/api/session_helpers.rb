# frozen_string_literal: true

module SessionHelpers
  def session
    env['rack.session']
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def authenticate!
    error!('Unauthorized', 401) unless current_user
  end
end
