# frozen_string_literal: true

module SessionHelpers
  def session
    env['rack.session']
  end

  def current_user
    return nil unless session[:user]
    @current_user ||= User.new(session[:user])
  end

  def authenticate!
    error!('Unauthorized', 401) unless current_user
  end
end
