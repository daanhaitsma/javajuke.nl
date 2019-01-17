import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class HomePage extends PolymerElement {
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
          grid-template-columns: 48px 1fr;
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
      </style>
      <div class="page-header"><p class="title">Queue</p></div>
      <div class="content-grid">
        <template is="dom-repeat" items="[[state.trackList]]" as="track">
          <div class="card track-card">
            <img
              class="track-card-disc"
              src="[[_getCoverArt(track.album.coverPath)]]"
              alt=""
            />
            <div class="track-card-content">
              <p
                class$="track-title[[_active(track.id, state.currentTrack.id)]]"
              >
                [[track.title]]
              </p>
              <p class="track-artist">[[track.artist]]</p>
            </div>
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
      user: Object,
      state: Object
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
    return (
      `../../assets/uploads/albumcover/${coverArt}` ||
      "../../assets/images/icons/default_cover_art.svg"
    );
  }
}

window.customElements.define("home-page", HomePage);
