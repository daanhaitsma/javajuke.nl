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
    return new Promise((resolve, reject) => {
      this.set("registerBody", {
        email: email,
        username: username,
        password: password
      });
      this.$.register
        .generateRequest()
        .completes.then(request => {
          let user = request.response;
          resolve(user);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  login(email, username, password) {
    return new Promise((resolve, reject) => {
      this.set("loginBody", {
        email: email,
        username: username,
        password: password
      });
      this.$.login
        .generateRequest()
        .completes.then(request => {
          let token = request.response;
          console.log(request.response);
          resolve(token);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  register(email, username, password) {
    return new Promise((resolve, reject) => {
      this.set("registerBody", {
        email: email,
        username: username,
        password: password
      });
      this.$.register
        .generateRequest()
        .completes.then(request => {
          let response = request.response;
          resolve(response);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.logout.generateRequest();
    });
  }
  getUser() {
    return new Promise((resolve, reject) => {
      this.set("headers", apiHelper.getApiHeaders());
      this.$.getUser
        .generateRequest()
        .completes.then(request => {
          let user = request.response;
          console.log(user);
          resolve(user);
        })
        .catch(error => {
          reject(error.request);
        });
    });
  }
}

window.customElements.define("repository-auth", RepositoryAuth);
