class Sticker < ApplicationRecord
  self.table_name = "tbl9kLyUrZNCJWf3L"

  field :name, "Name"
  field :active, "active"
  field :autonumber, "id"
  field :image_attachment, "image"
  field :event_URL, "event_URL"

  scope :only_active, -> { where(active: true) }

  def as_json(options = nil)
    { id: autonumber, name: name, image: image, event_URL: event_url }
  end

  def event_url
    url = event_URL
    url.is_a?(String) ? url : url&.dig("url")
  end

  def image = image_attachment&.dig(0, "url")

end