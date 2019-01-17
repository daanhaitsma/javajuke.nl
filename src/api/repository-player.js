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
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="setVolume"
        method="PUT"
        content-type="application/x-www-form-urlencoded"
        url="[[setVolumeUrl]]"
        body="[[setVolumeBody]]"
        headers="[[headers]]"
      >
      </iron-ajax>
      <iron-ajax
        id="addToQueue"
        method="PUT"
        content-type="application/x-www-form-urlencoded"
        url="[[addToQueueUrl]]"
        body="[[addToQueueBody]]"
        headers="[[headers]]"
      >
      </iron-ajax>
      <iron-ajax
        id="togglePlay"
        method="PUT"
        url="[[togglePlayUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="toggleShuffle"
        method="PUT"
        url="[[toggleShuffleUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="toggleRepeat"
        method="PUT"
        url="[[toggleRepeatUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="nextTrack"
        method="PUT"
        url="[[nextTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="previousTrack"
        method="PUT"
        url="[[previousTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="playPlaylist"
        method="PUT"
        url="[[playPlaylistUrl]]"
        headers="[[headers]]"
        handle-as="json"
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
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.getState
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  setVolume(volume) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("setVolumeBody", { volume: volume });
      this.$.setVolume
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  addToQueue(track) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("addToQueueBody", { track: track });
      this.$.addToQueue
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  togglePlay() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.togglePlay
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  toggleRepeat() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.toggleRepeat
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  toggleShuffle() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.toggleShuffle
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  nextTrack() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.nextTrack
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  previousTrack() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.previousTrack
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  playPlaylist(id) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("playPlaylistUrl", apiHelper.playPlaylistUrl(id));
      this.$.playPlaylist
        .generateRequest()
        .completes.then(request => {
          let state = request.response;
          resolve(this._formatState(state));
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  _formatState(state) {
    state.position = Math.round(Number(state.position) / 1000);
    return state;
  }
}

window.customElements.define("repository-player", RepositoryPlayer);
