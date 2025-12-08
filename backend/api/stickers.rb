# frozen_string_literal: true

class Stickers < Base
  helpers SessionHelpers

  resource :stickers do
    get do
      Sticker.only_active.all.map(&:as_json) + [current_user: current_user]
    end

    before do
      @sticker = Sticker.only_active.where(autonumber: params[:id]).first || error!('not found', 404)
    end

    route_param :id, type: String do
      before { authenticate! }
      get do
        @sticker.as_json
      end
      get '/backwards' do
        @sticker.name.reverse
      end
    end
  end
end
