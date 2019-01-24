import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-input/paper-input.js";
import "../style/shared-styles.js";

class LoginPage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .content-grid {
          display: grid;
          width: 100%;
          height: 100%;
          padding: 16px;
          grid-template-columns: 100%;
          grid-template-rows: 1fr 1fr;
          grid-row-gap: 16px;
          box-sizing: border-box;
        }

        .logo {
          width: 216px;
          height: 216px;
          border-radius: 50%;
          box-shadow: var(--box-shadow), 0 0 0 32px rgba(0, 0, 0, 0.05),
            0 0 0 64px rgba(0, 0, 0, 0.05);
          background-color: #fff;
          object-fit: cover;
          align-self: end;
          justify-self: center;
        }

        .login-card {
          position: relative;
          padding: 8px 16px;
          width: 100%;
          max-width: 360px;
          box-sizing: border-box;
          align-self: center;
          justify-self: center;
        }

        .login-button {
          position: relative;
          margin: 8px calc(50% - 64px);
          width: 128px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-weight: 600;
          color: white;
          border-radius: 24px;
          background-color: var(--active-color);
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s ease;
        }

        .login-button:active {
          box-shadow: var(--box-shadow-active);
        }
      </style>

      <div class="content-grid">
        <img class="logo" src="assets/images/manifest/icon-512x512.png" />
        <div class="card login-card">
          <paper-input
            id="username"
            type="text"
            label="Username of Email"
            required
            error-message="Invalid username or email"
            auto-validate="[[autoValidate]]"
            invalid="{{usernameInvalid}}"
            value="{{username}}"
          ></paper-input>
          <paper-input
            id="password"
            type="password"
            label="Password"
            required
            error-message="Invalid password"
            auto-validate="[[autoValidate]]"
            pattern="[[passwordPattern]]"
            invalid="{{passwordInvalid}}"
            value="{{password}}"
          ></paper-input>
          <button class="login-button" on-click="_login">
            LOGIN<paper-ripple></paper-ripple>
          </button>
          <button class="login-button" on-click="_register">
            REGISTER<paper-ripple></paper-ripple>
          </button>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      },
      username: String,
      password: String,
      passwordPattern: {
        type: String,
        value: ".{8,}"
      },
      autoValidate: {
        type: Boolean,
        value: false
      },
      usernameInvalid: Boolean,
      passwordInvalid: Boolean
    };
  }

  _activeChanged(active) {
    // Check if page is active
    if (active) {
      // Reset inputs and validation
      this.set("autoValidate", false);
      this.set("username", "");
      this.set("password", "");
    }
  }

  _login() {
    // Validate inputs
    this.set("autoValidate", true);
    this.$.username.validate();
    this.$.password.validate();
    // Check if inputs are valid
    if (!this.usernameInvalid && !this.passwordInvalid) {
      // If so send an login event to the app-shell containing the username/email and password
      window.dispatchEvent(
        new CustomEvent("login-user", {
          detail: { username: this.username, password: this.password }
        })
      );
    }
  }
  _register() {
    // Send an navigation event to the app-shell containing the path
    window.dispatchEvent(
      new CustomEvent("set-path", { detail: { path: "/register" } })
    );
  }
}

window.customElements.define("login-page", LoginPage);
