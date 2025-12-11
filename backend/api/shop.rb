# frozen_string_literal: true

class Shop < Base
  helpers SessionHelpers

  resource :shop do
    get do
      records = ShopTable.all
      records.map do |record|
        {
          id: record.id,
          name: record["Name"],
          image: record["CDN_URL"],
          price: record["Cost"],
          description: record["Description"]
        }
      end
    end

    route_param :id, type: String do
      get do
        record = ShopTable.find(params[:id])
        error!('not found', 404) unless record
        {
          id: record.id,
          name: record["Name"],
          image: record["CDN_URL"],
          price: record["cost"],
          description: record["Description"]
        }
      end
    end
  end
end
