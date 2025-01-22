# frozen_string_literal: true

# name: discourse-saved-searches-extension
# about: Display an visible search link suggestion.
# version: 0.2
# authors: Marcos Gutierrez
# url: https://github.com/jumagura/discourse-saved-searches-extension

enabled_site_setting :saved_searches_extension_enabled

register_asset "stylesheets/saved-searches-extension.scss"

after_initialize do
  load File.expand_path("../app/controllers/saved_search_extension_controller.rb", __FILE__)
  Discourse::Application.routes.append do
    put "/add_parameter_to_list" => "saved_search_extension#add_element"
  end
  add_to_serializer(
    :current_user,
    :can_use_saved_searches?,
  ) { scope.can_use_saved_searches? }
end
