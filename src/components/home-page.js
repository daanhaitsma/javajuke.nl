import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
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
        .track-artist {
          color: #bdbdbd;
        }
        div.track-card:first-of-type > div.track-card-content > p.track-title {
          color: var(--active-color);
        }
      </style>
      <div class="page-header"><p class="title">Queue</p></div>
      <template is="dom-if" if="[[state.trackList.length]]">
        <div class="content-grid">
          <template is="dom-repeat" items="[[state.trackList]]" as="track">
            <div class="card track-card">
              <img
                class="track-card-disc"
                src="[[_getCoverArt(track.album.coverPath)]]"
                alt=""
              />
              <div class="track-card-content">
                <p class="track-title">[[track.title]]</p>
                <p class="track-artist">[[track.artist]]</p>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template is="dom-if" if="[[!state.trackList.length]]">
        <div class="empty-list-container">
          <iron-icon class="empty-list-icon" icon="track"></iron-icon>
          <p class="empty-list-message">There are no tracks in queue yet</p>
        </div>
      </template>
    `;
  }
  static get properties() {
    return {
      user: Object,
      state: Object
    };
  }

  _getCoverArt(coverArt) {
    if (coverArt) {
      // Return the cover art if the track has an album
      return `https://coverart.javajuke.nl/${coverArt}`;
    } else {
      // Else return the default art
      return "../../assets/images/icons/default_cover_art.svg";
    }
  }
}

window.customElements.define("home-page", HomePage);
