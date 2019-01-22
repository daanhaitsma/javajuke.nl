import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-input/paper-input.js";
import "../style/shared-styles.js";

class RegisterPage extends PolymerElement {
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
            label="Username"
            required
            error-message="Username has to be atleast 5 characters"
            auto-validate="[[autoValidate]]"
            pattern="[[usernamePattern]]"
            invalid="{{usernameInvalid}}"
            value="{{username}}"
          ></paper-input>
          <paper-input
            id="email"
            type="email"
            label="Email"
            required
            error-message="Invalid Email"
            auto-validate="[[autoValidate]]"
            invalid="{{emailInvalid}}"
            value="{{email}}"
          ></paper-input>
          <paper-input
            id="password"
            type="password"
            label="Password"
            required
            error-message="Password has to be atleast 8 characters"
            auto-validate="[[autoValidate]]"
            pattern="[[passwordPattern]]"
            invalid="{{passwordInvalid}}"
            value="{{password}}"
          ></paper-input>
          <paper-input
            id="passwordRepeat"
            type="password"
            label="Repeat password"
            required
            error-message="Password does not match"
            auto-validate="[[autoValidate]]"
            pattern="[[password]]"
            invalid="{{passwordRepeatInvalid}}"
            value="{{passwordRepeat}}"
          ></paper-input>
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
      email: String,
      password: String,
      passwordRepeat: String,
      usernamePattern: {
        type: String,
        value: "[a-zA-Z]{5,}"
      },
      passwordPattern: {
        type: String,
        value: ".{8,}"
      },
      autoValidate: {
        type: Boolean,
        value: false
      },
      usernameInvalid: Boolean,
      emailInvalid: Boolean,
      passwordInvalid: Boolean,
      passwordRepeatInvalid: Boolean
    };
  }

  _activeChanged(active) {
    if (active) {
      this.set("autoValidate", false);
      this.set("username", "");
      this.set("email", "");
      this.set("password", "");
      this.set("passwordRepeat", "");
    }
  }

  _register() {
    this.set("autoValidate", true);
    this.$.username.validate();
    this.$.email.validate();
    this.$.password.validate();
    this.$.passwordRepeat.validate();
    if (
      !this.usernameInvalid &&
      !this.emailInvalid &&
      !this.passwordInvalid &&
      !this.passwordRepeatInvalid
    ) {
      window.dispatchEvent(
        new CustomEvent("register-user", {
          detail: {
            username: this.username,
            email: this.email,
            password: this.password
          }
        })
      );
    }
  }
}

window.customElements.define("register-page", RegisterPage);
