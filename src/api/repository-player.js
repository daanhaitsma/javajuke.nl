import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiHelper from "../utils/apiHelper.js";

class RepositoryPlayer extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
        id="getState"
        method="GET"
        url="[[getStateUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="setVolume"
        method="PUT"
        content-type="application/x-www-form-urlencoded"
        url="[[setVolumeUrl]]"
        body="[[setVolumeBody]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="addToQueue"
        method="PUT"
        content-type="application/x-www-form-urlencoded"
        url="[[addToQueueUrl]]"
        body="[[addToQueueBody]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="togglePlay"
        method="PUT"
        url="[[togglePlayUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="toggleShuffle"
        method="PUT"
        url="[[toggleShuffleUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="toggleRepeat"
        method="PUT"
        url="[[toggleRepeatUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="nextTrack"
        method="PUT"
        url="[[nextTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="previousTrack"
        method="PUT"
        url="[[previousTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="playPlaylist"
        method="PUT"
        url="[[playPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      getStateUrl: {
        type: String,
        value: apiHelper.getStateUrl()
      },
      setVolumeUrl: {
        type: String,
        value: apiHelper.setVolumeUrl()
      },
      addToQueueUrl: {
        type: String,
        value: apiHelper.addToQueueUrl()
      },
      togglePlayUrl: {
        type: String,
        value: apiHelper.togglePlayUrl()
      },
      toggleShuffleUrl: {
        type: String,
        value: apiHelper.toggleShuffleUrl()
      },
      toggleRepeatUrl: {
        type: String,
        value: apiHelper.toggleRepeatUrl()
      },
      nextTrackUrl: {
        type: String,
        value: apiHelper.nextTrackUrl()
      },
      previousTrackUrl: {
        type: String,
        value: apiHelper.previousTrackUrl()
      },
      playPlaylistUrl: String,
      setVolumeBody: Object,
      addToQueueBody: Object,
      headers: {
        type: Object,
        value: apiHelper.getApiHeaders()
      }
    };
  }
  getState() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.getState
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  setVolume(volume) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Set the request body
      this.set("setVolumeBody", { volume: volume });
      // Generate the request
      this.$.setVolume
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  addToQueue(track) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Set the request body
      this.set("addToQueueBody", { track: track });
      // Generate the request
      this.$.addToQueue
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  togglePlay() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.togglePlay
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  toggleRepeat() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.toggleRepeat
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  toggleShuffle() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.toggleShuffle
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  nextTrack() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.nextTrack
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  previousTrack() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.previousTrack
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  playPlaylist(id) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("playPlaylistUrl", apiHelper.playPlaylistUrl(id));
      // Generate the request
      this.$.playPlaylist
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          // Resolve the promise with the response
          resolve(this._formatState(state));
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }

  _formatState(state) {
    // Change the returned playing position from miliseconds to seconds
    state.position = Math.round(Number(state.position) / 1000);
    return state;
  }
}

window.customElements.define("repository-player", RepositoryPlayer);
