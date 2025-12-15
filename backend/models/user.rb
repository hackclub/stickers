# frozen_string_literal: true

class User
  attr_accessor :id, :email, :name, :slack_id

  def initialize(attrs = {})
    @id = attrs[:id]
    @email = attrs[:email]
    @name = attrs[:name]
    @slack_id = attrs[:slack_id]
  end

  def self.from_omniauth(auth)
    new(
      id: auth.uid,
      email: auth.info.email,
      name: auth.info.name,
      slack_id: auth.info.slack_id
    )
  end

  def identifier
    slack_id || id
  end

  def to_h
    { id: id, email: email, name: name, slack_id: slack_id }
  end
end
