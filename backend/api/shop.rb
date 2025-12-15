# frozen_string_literal: true

class Shop < Grape::API
  format :json
  helpers SessionHelpers

  resource :shop do
    get do
      ShopRecord.all.map(&:as_json)
    end

    route_param :id, type: String do
      get do
        record = ShopRecord.find(params[:id])
        error!('not found', 404) unless record
        record.as_json
      end
    end
  end
end
