# frozen_string_literal: true

class ShopRecord < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = 'shop'

  field :name, 'Name'
  field :image, 'CDN_URL'
  field :price, 'Cost'
  field :description, 'Description'

  def as_json(options = nil)
    {
      id: id,
      name: name,
      image: image,
      price: price,
      description: description
    }
  end
end
