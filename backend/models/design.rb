# frozen_string_literal: true

class Design < AirctiveRecord::Base
  self.base_key = ENV['AIRTABLE_BASE_ID']
  self.table_name = 'designs'

  field :name, 'Name'
  field :description, 'Description'
  field :image_url, 'Image_URL'
  field :cdn_url, 'CDN_URL'
  field :slack_id, 'slack_id'
  field :status, 'Status'
  field :votes, 'Votes'
  field :voted_by, 'voted_by'
  field :created, 'Created'

  ALLOWED_FIELDS = %w[Name Description Image_URL].freeze

  scope :approved, -> { where(status: 'approved') }
  scope :by_user, ->(slack_id) { where(slack_id: slack_id) }

  def vote!(user_id)
    voted_users = voted_list
    
    if voted_users.include?(user_id)
      voted_users.delete(user_id)
      self.votes = [votes.to_i - 1, 0].max
    else
      voted_users << user_id
      self.votes = votes.to_i + 1
    end
    
    self.voted_by = voted_users.join(',')
    save
  end

  def voted_by_user?(user_id)
    voted_list.include?(user_id)
  end

  def as_json(options = nil)
    user_id = options&.dig(:user_id)
    {
      id: id,
      cdn_url: cdn_url,
      slack_id: slack_id,
      name: name,
      status: status,
      votes: votes || 0,
      submitted_at: created,
      voted: user_id ? voted_by_user?(user_id) : false
    }
  end

  def as_approved_json(options = nil)
    user_id = options&.dig(:user_id)
    {
      id: id,
      cdn_url: cdn_url,
      name: name,
      votes: votes || 0,
      voted: user_id ? voted_by_user?(user_id) : false
    }
  end

  private

  def voted_list
    (voted_by || '').split(',').map(&:strip).reject(&:empty?)
  end
end
