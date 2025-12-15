# frozen_string_literal: true

class StickerRecord < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = 'stickerDB'

  field :name, 'Sticker Name'
  field :image, 'CDN_URL'
  field :artist, 'Artist'
  field :event, 'Event'
  field :owned_by, 'owned_by'

  def as_json(options = nil)
    user_id = options&.dig(:user_id)
    owners = (owned_by || '').split(',').map(&:strip)
    {
      id: id,
      name: name,
      image: image,
      artist: artist,
      event: event,
      owned_by: owned_by,
      owned: user_id && owners.include?(user_id)
    }
  end

  def as_detail_json(options = nil)
    {
      id: id,
      name: name,
      image: image,
      artist: artist,
      event: event
    }
  end
end
