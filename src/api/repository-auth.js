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
      >
      </iron-ajax>
      <iron-ajax
        id="login"
        method="POST"
        content-type="application/x-www-form-urlencoded"
        body="[[loginBody]]"
        url="[[loginUrl]]"
      >
      </iron-ajax>
      <iron-ajax
        id="getUser"
        method="GET"
        content-type="application/x-www-form-urlencoded"
        url="[[getUserUrl]]"
        headers="[[headers]]"
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
      getUserUrl: {
        type: String,
        value: apiHelper.getUserUrl()
      },
      registerBody: String,
      loginBody: String,
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
          reject(error);
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
          reject(error);
        });
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
          reject(error);
        });
    });
  }
}

window.customElements.define("repository-auth", RepositoryAuth);
