import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";

class BottomBar extends PolymerElement {
  static get template() {
    return html`
      <style>
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

        p {
          margin: 0;
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
        <div class="bottom-bar-button">
          <iron-icon icon="home"></iron-icon>
          <p>Home</p>
          <paper-ripple center></paper-ripple>
        </div>
        <div class="bottom-bar-button">
          <iron-icon icon="search"></iron-icon>
          <p>Search</p>
          <paper-ripple center></paper-ripple>
        </div>
        <div class="bottom-bar-button">
          <iron-icon icon="folder"></iron-icon>
          <p>Library</p>
          <paper-ripple center></paper-ripple>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {};
  }
}

window.customElements.define("bottom-bar", BottomBar);
