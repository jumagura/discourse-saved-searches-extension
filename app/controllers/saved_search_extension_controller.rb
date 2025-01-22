class SavedSearchExtensionController < ApplicationController
  before_action :ensure_logged_in

  def add_element
    raise Discourse::InvalidParameters.new(:missing_username) unless params[:username].present?
    raise Discourse::InvalidParameters.new(:missing_search_term) unless params[:search_term].present?
    user = User.find_by(username: params[:username])
    raise Discourse::NotFound unless user
    guardian.ensure_can_edit!(user)
    user.guardian.ensure_can_use_saved_searches!
    searches_stored = user.saved_searches

    if searches_stored.count >= SiteSetting.max_saved_searches
      raise Discourse::InvalidParameters.new(:limit_reached)
    end

    query = params[:search_term].strip
    frequency = SavedSearch.frequencies[:daily]
    SavedSearch.transaction do
      saved_search = user.saved_searches.find_or_initialize_by(query: query)
      saved_search.frequency ||= frequency
      saved_search.save!
    end
  end
end
