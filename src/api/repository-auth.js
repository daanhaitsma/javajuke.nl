import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import * as apiHelper from "../utils/apiHelper.js";

class RepositoryAuth extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
        id="register"
        method="POST"
        content-type="application/x-www-form-urlencoded"
        body="[[registerBody]]"
        url="[[registerUrl]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="login"
        method="POST"
        content-type="application/x-www-form-urlencoded"
        body="[[loginBody]]"
        url="[[loginUrl]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="logout"
        method="GET"
        content-type="application/x-www-form-urlencoded"
        url="[[logoutUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
      <iron-ajax
        id="getUser"
        method="GET"
        content-type="application/x-www-form-urlencoded"
        url="[[getUserUrl]]"
        headers="[[headers]]"
        reject-with-request
      >
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      registerUrl: {
        type: String,
        value: apiHelper.registerUrl()
      },
      loginUrl: {
        type: String,
        value: apiHelper.loginUrl()
      },
      logoutUrl: {
        type: String,
        value: apiHelper.logoutUrl()
      },
      getUserUrl: {
        type: String,
        value: apiHelper.getUserUrl()
      },
      registerBody: Object,
      loginBody: Object,
      headers: {
        type: Object,
        value: apiHelper.getApiHeaders()
      }
    };
  }
  register(email, username, password) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Set the request body
      this.set("registerBody", {
        email: email,
        username: username,
        password: password
      });
      // Generate the request
      this.$.register
        .generateRequest()
        .completes.then(request => {
          let user = request.response;
          // Resolve the promise with the response
          resolve(user);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  login(username, password) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Set the request body
      this.set("loginBody", {
        username: username,
        password: password
      });
      // Generate the request
      this.$.login
        .generateRequest()
        .completes.then(request => {
          let token = request.response;
          // Resolve the promise with the response
          resolve(token);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  register(email, username, password) {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Set the request body
      this.set("registerBody", {
        email: email,
        username: username,
        password: password
      });
      // Generate the request
      this.$.register
        .generateRequest()
        .completes.then(request => {
          let response = request.response;
          // Resolve the promise with the response
          resolve(response);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
  logout() {
    // Get the authentication headers
    this.set("headers", apiHelper.getApiHeaders());
    // Generate the request
    this.$.logout.generateRequest();
  }
  getUser() {
    // Return a promise
    return new Promise((resolve, reject) => {
      // Get the authentication headers
      this.set("headers", apiHelper.getApiHeaders());
      // Generate the request
      this.$.getUser
        .generateRequest()
        .completes.then(request => {
          let user = request.response;
          // Resolve the promise with the response
          resolve(user);
        })
        .catch(error => {
          // Reject the promise with the failed request
          reject(error.request);
        });
    });
  }
}

window.customElements.define("repository-auth", RepositoryAuth);
