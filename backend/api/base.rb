# frozen_string_literal: true

class Base < Grape::API
  format :json
  helpers SessionHelpers
end
