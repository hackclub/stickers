class ApplicationRecord < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE']
end
