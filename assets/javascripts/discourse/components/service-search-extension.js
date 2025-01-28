import Component from "@glimmer/component";
import { service } from "@ember/service";
import I18n from "I18n";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DiscourseURL from "discourse/lib/url";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class ServiceSearchExtension extends Component {
  @service search;
  @service currentUser;
  @service dialog;

  @tracked showSuccessMessage = false;

  get searchTerm() {
    return this.search.activeGlobalSearchTerm;
  }

  get completeText() {
    return I18n.t("button.label", { term: this.searchTerm });
  }

  @action
  async addToList() {
    const path = "/add_parameter_to_list";
    try {
      await ajax(path, {
        type: "PUT",
        data: {
          username: this.currentUser.username,
          search_term: this.searchTerm,
        },
      });

      this.showSuccessMessage = true;

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 2000);
    } catch (error) {
      let errorMessage = error.jqXHR?.responseJSON?.errors?.[0] || "";
      let errorKey = errorMessage.split(": ").pop().trim();

      const errorMessages = {
        missing_username: "js.message_error.missing_username",
        missing_search_term: "js.message_error.missing_parameter",
        limit_reached: "js.message_error.limit_reached",
        not_found: "js.message_error.missing_username",
      };

      if (errorMessages[errorKey]) {
        const message = i18n(errorMessages[errorKey]);
        if (errorKey === "limit_reached") {
          const buttons = [
            {
              label: "OK",
              class: "btn btn-default",
            },
            {
              label: i18n("js.message_error.limit_reached_button"),
              class: "btn btn-primary",
              action: () => {
                DiscourseURL.routeTo(`/my/preferences/saved-searches`);
              },
            },
          ];
          this.dialog.dialog({ message, buttons, type: "confirm" });
        } else {
          this.dialog.alert(message);
        }
      } else {
        popupAjaxError(error);
      }
    }
  }

  @action
  settings() {
    DiscourseURL.routeTo(`/my/preferences/saved-searches`);
  }
}
