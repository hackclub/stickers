# frozen_string_literal: true

class Stickers < Grape::API
  format :json
  helpers SessionHelpers

  resource :stickers do
    get do
      user_id = current_user&.identifier
      StickerRecord.all.map { |r| r.as_json(user_id: user_id) }
    end

    route_param :id, type: String do
      before { authenticate! }
      get do
        record = StickerRecord.find(params[:id])
        error!('not found', 404) unless record
        record.as_detail_json
      end
    end
  end
end
