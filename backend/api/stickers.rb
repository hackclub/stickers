# frozen_string_literal: true

class Stickers < Base
  helpers SessionHelpers

  resource :stickers do
    get do
      records = StickersTable.all
      records.map do |record|
        {
          id: record.id,
          name: record["Sticker Name"],
          image: record["CDNURL"],
          artist: record["Artist"],
          event: record["Event"]
        }
      end
    end

    route_param :id, type: String do
      get do
        record = StickersTable.find(params[:id])
        error!('not found', 404) unless record
        {
          id: record.id,
          name: record["Sticker Name"],
          image: record["CDNURL"],
          artist: record["Artist"],
          event: record["Event"]
        }
      end
    end
  end
end
