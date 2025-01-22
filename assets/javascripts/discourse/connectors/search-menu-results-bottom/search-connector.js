import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class extends Component {
  @service currentUser;

  get shouldRender() {
    return this.currentUser?.can_use_saved_searches;
  }
}
