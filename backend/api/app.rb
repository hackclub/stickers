# frozen_string_literal: true

class App < Grape::API
  format :json

  mount Auth
  mount Stickers
  mount Shop
  mount Designs
end
