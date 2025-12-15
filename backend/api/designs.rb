# frozen_string_literal: true

class StickersTable < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = "stickerDB"
end

class ShopTable < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = "shop"
end

class DesignsTable < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = "designs"
end

class Designs < Base
  DESIGN_ALLOWED_FIELDS = %w[Name Description Image_URL CDN_URL].freeze

  resource :designs do
    get :all do
      error!('Unauthorized', 401) unless current_user
      user_id = current_user[:slack_id] || current_user[:id]
      records = DesignsTable.all
      approved = records.select { |r| r['Status']&.downcase == 'approved' }
      approved.map do |record|
        voted_by = (record['voted_by'] || '').split(',').map(&:strip)
        {
          id: record.id,
          cdn_url: record['CDN_URL'],
          name: record['Name'],
          votes: record['Votes'] || 0,
          voted: voted_by.include?(user_id)
        }
      end
    end

    get do
      error!('Unauthorized', 401) unless current_user
      slack_id = current_user[:slack_id] || current_user[:id]
      records = DesignsTable.all
      records.select { |r| r['Slack_ID'] == slack_id }.map do |record|
        {
          id: record.id,
          cdn_url: record['CDN_URL'],
          slack_id: record['Slack_ID'],
          name: record['Name'],
          status: record['Status'],
          votes: record['Votes'],
          submitted_at: record['Created']
        }
      end
    end

    post do
      error!('Unauthorized', 401) unless current_user
      puts "=== DEBUG: POST /designs ==="
      puts "params: #{params.inspect}"
      puts "params[:fields]: #{params[:fields].inspect}"
      fields = (params[:fields] || {}).transform_keys(&:to_s)
      puts "fields after transform: #{fields.inspect}"
      safe_fields = fields.slice(*DESIGN_ALLOWED_FIELDS)
      puts "safe_fields after slice: #{safe_fields.inspect}"
      safe_fields['Slack_ID'] = current_user[:slack_id] || current_user[:id]
      safe_fields['Status'] = 'Pending'
      safe_fields['Votes'] = 0
      puts "final safe_fields: #{safe_fields.inspect}"
      begin
        result = DesignsTable.create(safe_fields)
        puts "create result: #{result.inspect}"
        result
      rescue => e
        puts "ERROR: #{e.class}: #{e.message}"
        puts e.backtrace.first(10).join("\n")
        raise
      end
    end

    route_param :id do
      post :vote do
        error!('Unauthorized', 401) unless current_user
        user_id = current_user[:slack_id] || current_user[:id]
        design = DesignsTable.find(params[:id])
        error!('Design not found', 404) unless design

        voted_by = (design['voted_by'] || '').split(',').map(&:strip).reject(&:empty?)
        current_votes = design['Votes'] || 0

        if voted_by.include?(user_id)
          voted_by.delete(user_id)
          design['Votes'] = [current_votes - 1, 0].max
        else
          voted_by << user_id
          design['Votes'] = current_votes + 1
        end

        design['voted_by'] = voted_by.join(',')
        design.save
        { success: true, votes: design['Votes'], voted: voted_by.include?(user_id) }
      end
    end
  end
end
