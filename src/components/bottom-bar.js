import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "./shared-styles.js";

class BottomBar extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .bottom-bar {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 48px;
          grid-row-gap: 16px;
          justify-items: center;
          align-items: center;
          width: 100%;
          height: 48px;
          background-color: #fff;
          border-top: 1px solid #eee;
        }

        .bottom-bar-button {
          position: relative;
          width: 100%;
          height: 48px;
          padding: 3px 0px;
          box-sizing: border-box;
          text-align: center;
          color: #757575;
        }

        .bottom-bar-title {
          font-size: 12px;
        }

        @supports (padding-bottom: constant(safe-area-inset-bottom)) {
          .bottom-bar {
            padding-bottom: constant(safe-area-inset-bottom);
          }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-bar {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      </style>

      <div class="bottom-bar">
        <div class="bottom-bar-button" on-click="_home">
          <iron-icon icon="home"></iron-icon>
          <p class="bottom-bar-title">Home</p>
          <paper-ripple center></paper-ripple>
        </div>
        <div class="bottom-bar-button">
          <iron-icon icon="folder"></iron-icon>
          <p class="bottom-bar-title">Library</p>
          <paper-ripple center></paper-ripple>
        </div>
        <div class="bottom-bar-button">
          <iron-icon icon="settings"></iron-icon>
          <p class="bottom-bar-title">Settings</p>
          <paper-ripple center></paper-ripple>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {};
  }

  _home() {
    window.dispatchEvent(
      new CustomEvent("set-path", { detail: { path: "/home", history: [] } })
    );
  }
}

window.customElements.define("bottom-bar", BottomBar);
