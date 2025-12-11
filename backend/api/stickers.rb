# frozen_string_literal: true

class Stickers < Base
  helpers SessionHelpers

  resource :stickers do
    get do
      user_id = current_user ? (current_user[:slack_id] || current_user[:id]) : nil
      records = StickersTable.all
      records.map do |record|
        owned_by = record["owned_by"] || ""
        owners = owned_by.split(',').map(&:strip)
        {
          id: record.id,
          name: record["Sticker Name"],
          image: record["CDN_URL"],
          artist: record["Artist"],
          event: record["Event"],
          owned_by: owned_by,
          owned: user_id && owners.include?(user_id) 
        }
      end
    end

    route_param :id, type: String do
      before { authenticate! }
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
