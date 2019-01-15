import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiHelper from "../utils/apiHelper.js";

class RepositoryTracks extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
        id="getTracks"
        method="GET"
        url="[[getTracksUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="getTrack"
        method="GET"
        url="[[getTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="deleteTrack"
        method="DELETE"
        url="[[deleteTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      getTracksUrl: {
        type: String,
        value: apiHelper.getTracksUrl()
      },
      getTrackUrl: String,
      deleteTrackUrl: String,
      headers: {
        type: Object,
        value: apiHelper.getApiHeaders()
      }
    };
  }
  getTracks() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.getTracks
        .generateRequest()
        .completes.then(request => {
          let tracks = request.response.data;
          resolve(tracks);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTrack(id) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("getTrackUrl", apiHelper.getTrackUrl(id));
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
  deleteTrack(id) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("deleteTrackUrl", apiHelper.deleteTrackUrl(id));
      this.$.deleteTrack
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
