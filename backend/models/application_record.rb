class ApplicationRecord < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
end
