import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class HomePage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .content-grid {
          display: grid;
          width: 100%;
          padding: 16px;
          grid-template-columns: 100%;
          grid-auto-rows: 64px;
          grid-row-gap: 16px;
          box-sizing: border-box;
        }
        @media screen and (min-width: 640px) {
          .content-grid {
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 16px;
          }
        }
        @media screen and (min-width: 1280px) {
          .content-grid {
            padding-left: calc(50% - 624px);
            padding-right: calc(50% - 624px);
          }
        }

        .track-card {
          position: relative;
          display: grid;
          padding: 8px;
          width: 100%;
          height: 64px;
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
          color: #757575;
        }
        .track-title.active {
          color: var(--active-color);
        }
        .track-artist {
          color: #bdbdbd;
        }
        .icon-button {
          align-self: center;
          justify-self: center;
        }
      </style>

      <div class="content-grid">
        <template is="dom-repeat" items="[[tracks]]" as="track">
          <div
            data-action="play"
            data-track$="[[track.id]]"
            class="card track-card"
            on-click="_trackClick"
          >
            <img
              data-action="play"
              data-track$="[[track.id]]"
              class="track-card-disc"
              src="[[_getCoverArt(track.art)]]"
              alt=""
            />
            <div
              data-action="play"
              data-track$="[[track.id]]"
              class="track-card-content"
            >
              <p
                data-action="play"
                data-track$="[[track.id]]"
                class$="track-title[[_active(track.id, player.track.id)]]"
              >
                [[track.title]]
              </p>
              <p
                data-action="play"
                data-track$="[[track.id]]"
                class="track-artist"
              >
                [[track.artist]]
              </p>
            </div>
            <div
              data-action="options"
              data-track$="[[track.id]]"
              class="icon-button"
              on-down="_onDown"
            >
              <iron-icon
                data-action="options"
                data-track$="[[track.id]]"
                icon="options"
              ></iron-icon>
              <paper-ripple center></paper-ripple>
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
      tracks: Array
    };
  }

  _activeChanged(active) {
    if (active) {
      console.log(active);
    }
  }

  _active(track, activeTrack) {
    return track === activeTrack ? " active" : "";
  }

  _getCoverArt(coverArt) {
    return coverArt || "../../assets/images/icons/default_cover_art.svg";
  }

  _onDown(e) {
    // disable the ripple of the parent element
    e.stopPropagation();
  }

  _trackClick(e) {
    switch (e.target.dataset.action) {
      case "play":
        if (
          (this.player.track &&
            this.player.track.id !== Number(e.target.dataset.track)) ||
          !this.player.track
        ) {
          window.dispatchEvent(
            new CustomEvent("set-track", {
              detail: {
                track: this.tracks.find(item => {
                  return item.id === Number(e.target.dataset.track);
                })
              }
            })
          );
        }
        // window.dispatchEvent(
        //   new CustomEvent("set-path", { detail: { path: "/player" } })
        // );
        break;
      case "options":
        let track = this.tracks.find(item => {
          return item.id === Number(e.target.dataset.track);
        });
        console.log(`Track: ${track.title} - ${track.artist}`);
        break;
    }
  }
}

window.customElements.define("home-page", HomePage);
