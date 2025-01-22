# frozen_string_literal: true

# name: discourse-saved-searches-extension
# about: Display an visible search link suggestion.
# version: 0.1
# authors: Marcos Gutierrez
# url: TODO

enabled_site_setting :saved_searches_extension_enabled

register_asset "stylesheets/saved-searches-extension.scss"

after_initialize do
  load File.expand_path("../app/controllers/saved_search_extension_controller.rb", __FILE__)
  Discourse::Application.routes.append do
    put "/add_parameter_to_list" => "saved_search_extension#add_element"
  end
end
