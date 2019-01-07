import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "./shared-styles.js";

class PlaylistsPage extends PolymerElement {
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

        .playlist-card {
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
        .playlist-card.yours {
          grid-template-columns: 48px 1fr 48px;
        }
        .playlist-length {
          align-self: center;
          justify-self: center;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-weight: 600;
          color: white;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.05);
        }
        .playlist-card-content {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 1fr;
          align-items: center;
        }
        .playlist-title,
        .playlist-author {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .playlist-title {
          font-weight: 600;
          color: #757575;
        }
        .playlist-author {
          color: #bdbdbd;
        }
        .icon-button {
          align-self: center;
          justify-self: center;
        }
      </style>

      <div class="content-grid">
        <template is="dom-repeat" items="[[playlists]]" as="playlist">
          <div
            data-action="open"
            data-playlist$="[[playlist.id]]"
            class$="card playlist-card[[_isYourPlaylist(playlist.isYours)]]"
            on-click="_playlistClick"
          >
            <div
              data-action="open"
              data-playlist$="[[playlist.id]]"
              class="playlist-length"
            >
              [[playlist.tracks.length]]
            </div>
            <div
              data-action="open"
              data-playlist$="[[playlist.id]]"
              class="playlist-card-content"
            >
              <p
                data-action="open"
                data-playlist$="[[playlist.id]]"
                class="playlist-title"
              >
                [[playlist.title]]
              </p>
              <p
                data-action="open"
                data-playlist$="[[playlist.id]]"
                class="playlist-author"
              >
                by [[playlist.author]]
              </p>
            </div>
            <template is="dom-if" if="[[playlist.isYours]]">
              <div
                data-action="options"
                data-playlist$="[[playlist.id]]"
                class="icon-button"
                on-down="_onDown"
              >
                <iron-icon
                  data-action="options"
                  data-playlist$="[[playlist.id]]"
                  icon="options"
                ></iron-icon>
                <paper-ripple center></paper-ripple>
              </div>
            </template>
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
      playlists: Array
    };
  }

  _activeChanged(active) {
    if (active) {
      console.log(active);
    }
  }

  _isYourPlaylist(isYours) {
    return isYours ? " yours" : "";
  }

  _onDown(e) {
    // disable the ripple of the parent element
    e.stopPropagation();
  }

  _playlistClick(e) {
    switch (e.target.dataset.action) {
      case "open":
        window.dispatchEvent(
          new CustomEvent("set-path", {
            detail: { path: `/playlist/${e.target.dataset.playlist}` }
          })
        );
        break;
      case "options":
        let playlist = this.playlists.find(item => {
          return item.id === Number(e.target.dataset.playlist);
        });
        console.log(playlist);
        break;
    }
  }
}

window.customElements.define("playlists-page", PlaylistsPage);
