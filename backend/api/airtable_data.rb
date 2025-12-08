class StickersTable < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = "stickerDB"
end

class AirtableData < Grape::API
  format :json
  
  helpers do
    def airtable_client
      StickersTable     
    end
  end

  get '/data' do
    records = airtable_client.all
    records.map(&:fields)  
  end

  post '/data' do
    airtable_client.create(params[:fields])
  end
end
