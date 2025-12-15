# frozen_string_literal: true

class Designs < Grape::API
  format :json
  helpers SessionHelpers

  resource :designs do
    get :all do
      error!('Unauthorized', 401) unless current_user
      user_id = current_user.identifier

      Design.approved.all.map { |d| d.as_approved_json(user_id: user_id) }
    end

    get do
      error!('Unauthorized', 401) unless current_user
      user_id = current_user.identifier

      Design.by_user(user_id).all.map { |d| d.as_json(user_id: user_id) }
    end

    post do
      error!('Unauthorized', 401) unless current_user
      
      safe_fields = (params[:fields] || {}).slice(*Design::ALLOWED_FIELDS)
      safe_fields['slack_id'] = current_user.identifier
      safe_fields['Status'] = 'pending'
      safe_fields['Votes'] = 0

      Design.create(safe_fields)
    end

    route_param :id do
      post :vote do
        error!('Unauthorized', 401) unless current_user
        user_id = current_user.identifier
        
        design = Design.find(params[:id])
        error!('Design not found', 404) unless design

        design.vote!(user_id)
        
        {
          success: true,
          votes: design.votes,
          voted: design.voted_by_user?(user_id)
        }
      end
    end
  end
end
