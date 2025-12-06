# frozen_string_literal: true

module SessionHelpers
  def session
    env['rack.session']
  end

  def current_user
    session[:user]
  end

  def authenticate!
    error!('Unauthorized', 401) unless current_user
  end
end
