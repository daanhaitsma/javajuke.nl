import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "./shared-styles.js";

class HomePage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .track-card {
          position: relative;
          display: grid;
          margin: 16px;
          padding: 8px;
          width: calc(100% - 32px);
          height: 64px;
          background-color: #fff;
          color: #757575;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          box-sizing: border-box;
          grid-template-columns: 48px 1fr 48px;
          grid-template-rows: 1fr;
          grid-column-gap: 8px;
        }
        .track-card-disc {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
          object-fit: cover;
          border: 1px solid #bdbdbd;
          box-sizing: border-box;
        }
        .track-card-content {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 1fr;
          align-items: center;
        }
        .track-title,
        .track-artist {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .track-title {
          font-weight: 600;
        }
        .track-artist {
          color: #bdbdbd;
        }
        .icon-button {
          align-self: center;
          justify-self: center;
        }
      </style>

      <div>
        <template is="dom-repeat" items="[[playlist]]" as="track">
          <div data-track$="[[track.id]]" class="track-card" on-click="_play">
            <img
              data-track$="[[track.id]]"
              class="track-card-disc"
              src="[[track.art]]"
              alt=""
            />
            <div data-track$="[[track.id]]" class="track-card-content">
              <p data-track$="[[track.id]]" class="track-title">
                [[track.title]]
              </p>
              <p data-track$="[[track.id]]" class="track-artist">
                [[track.artist]]
              </p>
            </div>
            <div data-track$="[[track.id]]" class="icon-button">
              <iron-icon data-track$="[[track.id]]" icon="play"></iron-icon>
            </div>
            <paper-ripple></paper-ripple>
          </div>
        </template>
      </div>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      },
      player: Object,
      playlist: Array
    };
  }

  _activeChanged(active) {
    if (active) {
      console.log(active);
    }
  }

  _play(e) {
    window.dispatchEvent(
      new CustomEvent("set-track", {
        detail: {
          track: this.playlist.find(item => {
            return item.id === Number(e.target.dataset.track);
          })
        }
      })
    );
    window.dispatchEvent(
      new CustomEvent("set-path", { detail: { path: "/player" } })
    );
  }
}

window.customElements.define("home-page", HomePage);
