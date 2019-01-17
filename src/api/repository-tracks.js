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
        id="searchTracks"
        method="GET"
        url="[[searchTracksUrl]]"
        params="[[searchTracksParams]]"
        headers="[[headers]]"
        handle-as="json"
      >
      </iron-ajax>
      <iron-ajax
        id="uploadTracks"
        method="POST"
        body="[[uploadTracksBody]]"
        url="[[uploadTracksUrl]]"
        headers="[[headers]]"
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
      searchTracksUrl: {
        type: String,
        value: apiHelper.searchTracksUrl()
      },
      uploadTracksUrl: {
        type: String,
        value: apiHelper.uploadTracksUrl()
      },
      getTrackUrl: String,
      deleteTrackUrl: String,
      searchTracksParams: Object,
      uploadTracksBody: Object,
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
  uploadTracks(files) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      this.set("headers", apiHelper.getApiHeaders());
      this.set("uploadTracksBody", formData);
      this.$.uploadTracks
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
  searchTracks(search) {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.set("searchTracksParams", { search: search });
      this.$.searchTracks
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
