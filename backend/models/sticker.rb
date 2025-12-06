class Sticker < ApplicationRecord
  self.table_name = "tbl9kLyUrZNCJWf3L"

  field :name, "Name"
  field :active, "active"
  field :autonumber, "id"
  field :image_attachment, "image"

  scope :only_active, -> { where(active: true) }

  def as_json(options = nil)
    { id: autonumber, name: name, image: }
  end

  def image = image_attachment&.dig(0, "url")

end