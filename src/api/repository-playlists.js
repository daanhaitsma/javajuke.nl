import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiConfig from "../utils/apiConfig.js";

class RepositoryPlaylists extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax id="getPlaylists" url="[[getPlaylistsUrl]]" handle-as="json">
      </iron-ajax>
      <iron-ajax id="getPlaylist" url="[[getPlaylistUrl]]" handle-as="json">
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      getPlaylistsUrl: {
        type: String,
        value: apiConfig.getPlaylistsUrl()
      },
      getPlaylistUrl: String
    };
  }
  getPlaylists() {
    return new Promise((resolve, reject) => {
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
      this.set("getPlaylistUrl", apiConfig.getPlaylistUrl(id));
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
