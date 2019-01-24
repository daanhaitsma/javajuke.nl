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
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.getPlaylists
        .generateRequest()
        .completes.then(request => {
          let Playlists = request.response.data;
          // Resolve the promise with the response
          resolve(Playlists);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error);
        });
    });
  }
  removeFromPlaylist(playlist, track) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set(
        "removeFromPlaylistUrl",
        apiHelper.removeFromPlaylistUrl(playlist, track)
      );
      // Generate the request
      this.$.removeFromPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          // Resolve the promise with the response
          resolve(playlists);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  addToPlaylist(playlist, track) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("addToPlaylistUrl", apiHelper.addToPlaylistUrl(playlist, track));
      // Generate the request
      this.$.addToPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          // Resolve the promise with the response
          resolve(playlists);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  createPlaylist(name) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Set the request body
      this.set("createPlaylistBody", {
        name: name
      });
      // Generate the request
      this.$.createPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlist = request.response;
          // Resolve the promise with the response
          resolve(playlist);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  getPlaylist(id) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("getPlaylistUrl", apiHelper.getPlaylistUrl(id));
      // Generate the request
      this.$.getPlaylist
        .generateRequest()
        .completes.then(request => {
          let playlist = request.response;
          // Resolve the promise with the response
          resolve(playlist);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  removePlaylist(id) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("removePlaylistUrl", apiHelper.removePlaylistUrl(id));
      // Generate the request
      this.$.removePlaylist
        .generateRequest()
        .completes.then(request => {
          let playlists = request.response;
          // Resolve the promise with the response
          resolve(playlists);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
}

window.customElements.define("repository-playlists", RepositoryPlaylists);
