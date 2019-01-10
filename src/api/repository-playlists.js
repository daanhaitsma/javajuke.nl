import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiHelper from "../utils/apiHelper.js";

class RepositoryPlaylists extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
        id="getPlaylists"
        method="GET"
        url="[[getPlaylistsUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="getPlaylist"
        method="GET"
        url="[[getPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      getPlaylistsUrl: {
        type: String,
        value: apiHelper.getPlaylistsUrl()
      },
      getPlaylistUrl: String,
      headers: {
        type: Object,
        value: apiHelper.getApiHeaders()
      }
    };
  }
  getPlaylists() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.getPlaylists
        .generateRequest()
        .completes.then(request => {
          let Playlists = request.response;
          resolve(Playlists);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getPlaylist(id) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("getPlaylistUrl", apiHelper.getPlaylistUrl(id));
      this.$.getPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlist = request.response;
          resolve(playlist);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

window.customElements.define("repository-playlists", RepositoryPlaylists);
