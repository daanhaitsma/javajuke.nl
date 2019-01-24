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
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="searchTracks"
        method="GET"
        url="[[searchTracksUrl]]"
        params="[[searchTracksParams]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="uploadTracks"
        method="POST"
        body="[[uploadTracksBody]]"
        url="[[uploadTracksUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="syncTracks"
        method="GET"
        url="[[syncTracksUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="getTrack"
        method="GET"
        url="[[getTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="deleteTrack"
        method="DELETE"
        url="[[deleteTrackUrl]]"
        headers="[[headers]]"
        handle-as="json"
        reject-with-request
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
      syncTracksUrl: {
        type: String,
        value: apiHelper.syncTracksUrl()
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
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.getTracks
        .generateRequest()
        .completes.then(request => {
          let tracks = request.response.data;
          // Resolve the promise with the response
          resolve(tracks);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  uploadTracks(files) {
    // Return a promise
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Set the request body
      this.set("uploadTracksBody", formData);
      // Generate the request
      this.$.uploadTracks
        .generateRequest()
        .completes.then(request => {
          let tracks = request.response.data;
          // Resolve the promise with the response
          resolve(tracks);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  searchTracks(search) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Set the request parameters
      this.set("searchTracksParams", { search: search });
      // Generate the request
      this.$.searchTracks
        .generateRequest()
        .completes.then(request => {
          let tracks = request.response.data;
          // Resolve the promise with the response
          resolve(tracks);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  getTrack(id) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("getTrackUrl", apiHelper.getTrackUrl(id));
      // Generate the request
      this.$.getTrack
        .generateRequest()
        .completes.then(request => {
          let track = request.response;
          // Resolve the promise with the response
          resolve(track);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  deleteTrack(id) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Get the request url
      this.set("deleteTrackUrl", apiHelper.deleteTrackUrl(id));
      // Generate the request
      this.$.deleteTrack
        .generateRequest()
        .completes.then(request => {
          let track = request.response;
          // Resolve the promise with the response
          resolve(track);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  syncTracks() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.syncTracks
        .generateRequest()
        .completes.then(request => {
          let track = request.response;
          // Resolve the promise with the response
          resolve(track);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
}

window.customElements.define("repository-tracks", RepositoryTracks);
