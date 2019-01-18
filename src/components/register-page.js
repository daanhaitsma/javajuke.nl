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
            type="text"
            label="Username"
            value="{{username}}"
          ></paper-input>
          <paper-input
            type="email"
            label="Email"
            value="{{email}}"
          ></paper-input>
          <paper-input
            type="password"
            label="Password"
            value="{{password}}"
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
      password: String
    };
  }

  _activeChanged(active) {
    if (active) {
      this.set("username", "");
      this.set("email", "");
      this.set("password", "");
    }
  }

  _register() {
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

window.customElements.define("register-page", RegisterPage);
