class User < ApplicationRecord
  self.table_name = "tblu0BvCreui4oARV"

  field :email, "email"
  field :name, "name"
  field :hca_id, "hca_id"
  field :hackatime_uid, "hackatime_uid"
  field :hackatime_access_token, "hackatime_access_token"

  def self.find_or_create_from_oidc(auth)
    user = where(hca_id: auth.uid).first
    return user if user

    create(
      hca_id: auth.uid,
      email: auth.info.email,
      name: auth.info.name
    )
  end

  def link_hackatime!(uid:, access_token:)
    self.hackatime_uid = uid
    self.hackatime_access_token = access_token
    save
  end

  def unlink_hackatime!
    self.hackatime_uid = nil
    self.hackatime_access_token = nil
    save
  end

  def hackatime_linked?
    hackatime_uid.present?
  end

  def as_json(options = nil)
    {
      id: id,
      email: email,
      name: name,
      hackatime_linked: hackatime_linked?
    }
  end
end
