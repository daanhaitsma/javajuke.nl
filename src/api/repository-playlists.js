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
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="removeFromPlaylist"
        method="DELETE"
        url="[[removeFromPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="addToPlaylist"
        method="POST"
        url="[[addToPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="createPlaylist"
        method="POST"
        content-type="application/x-www-form-urlencoded"
        body="[[createPlaylistBody]]"
        url="[[createPlaylistUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="getPlaylist"
        method="GET"
        url="[[getPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="removePlaylist"
        method="DELETE"
        url="[[removePlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
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
      createPlaylistUrl: {
        type: String,
        value: apiHelper.createPlaylistUrl()
      },
      getPlaylistUrl: String,
      removeFromPlaylistUrl: String,
      addToPlaylistUrl: String,
      removePlaylistUrl: String,
      createPlaylistBody: Object,
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
          let Playlists = request.response.data;
          resolve(Playlists);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  removeFromPlaylist(playlist, track) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set(
        "removeFromPlaylistUrl",
        apiHelper.removeFromPlaylistUrl(playlist, track)
      );
      this.$.removeFromPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          resolve(playlists);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  addToPlaylist(playlist, track) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("addToPlaylistUrl", apiHelper.addToPlaylistUrl(playlist, track));
      this.$.addToPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          resolve(playlists);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  createPlaylist(name) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("createPlaylistBody", {
        name: name
      });
      this.$.createPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlist = request.response;
          resolve(playlist);
        })
        .catch(error => {
          reject(error.request);
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
          reject(error.request);
        });
    });
  }
  removePlaylist(id) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("removePlaylistUrl", apiHelper.removePlaylistUrl(id));
      this.$.removePlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          resolve(playlists);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
}

window.customElements.define("repository-playlists", RepositoryPlaylists);
