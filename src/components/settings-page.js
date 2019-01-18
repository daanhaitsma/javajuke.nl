import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../style/shared-styles.js";

class SettingsPage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .page-header {
          width: 100%;
          padding: 16px;
          box-sizing: border-box;
        }
        .content-grid {
          display: grid;
          width: 100%;
          padding: 16px;
          grid-template-columns: 100%;
          grid-auto-rows: 48px;
          grid-row-gap: 16px;
          box-sizing: border-box;
        }
        @media screen and (min-width: 640px) {
          .content-grid {
            padding-left: calc(50% - 304px);
            padding-right: calc(50% - 304px);
          }
        }

        .settings-action {
          position: relative;
          width: 100%;
          height: 100%;
          color: white;
          font-weight: 600;
          border-radius: 24px;
          background-color: var(--active-color);
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s ease;
        }
        .settings-action:active {
          box-shadow: var(--box-shadow-active);
        }
      </style>
      <div class="page-header"><p class="title">Settings</p></div>
      <div class="content-grid">
        <button class="settings-action" on-click="_scanFolder">
          Scan public folder<paper-ripple></paper-ripple>
        </button>
        <button class="settings-action" on-click="_logout">
          Logout<paper-ripple></paper-ripple>
        </button>
      </div>
    `;
  }
  static get properties() {
    return {};
  }

  _scanFolder() {
    window.dispatchEvent(
        new CustomEvent("sync-tracks", {
          detail: {}
        })
      );
  }

  _logout() {
    window.dispatchEvent(
      new CustomEvent("logout-user", {
        detail: {}
      })
    );
  }
}

window.customElements.define("settings-page", SettingsPage);
