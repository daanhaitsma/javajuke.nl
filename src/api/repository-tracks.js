import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiConfig from "../utils/apiConfig.js";

class RepositoryTracks extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax id="getTracks" url="[[getTracksUrl]]" handle-as="json">
      </iron-ajax>
      <iron-ajax id="getTrack" url="[[getTrackUrl]]" handle-as="json">
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      getTracksUrl: {
        type: String,
        value: apiConfig.getTracksUrl()
      },
      getTrackUrl: String
    };
  }
  getTracks() {
    return new Promise((resolve, reject) => {
      this.$.getTracks
        .generateRequest()
        .completes.then(request => {
          let tracks = request.response;
          resolve(tracks);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTrack(id) {
    return new Promise((resolve, reject) => {
      this.set("getTrackUrl", apiConfig.getTrackUrl(id));
      this.$.getTrack
        .generateRequest()
        .completes.then(request => {
          let track = request.response;
          resolve(track);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

window.customElements.define("repository-tracks", RepositoryTracks);
