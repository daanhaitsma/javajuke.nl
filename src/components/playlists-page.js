import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-input/paper-input.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

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
        .playlist-card-content.all-tracks {
          grid-template-rows: 1fr;
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
        .create-playlist {
          position: relative;
          margin: 8px calc(50% - 64px) 0px calc(50% - 64px);
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
        .create-playlist:active {
          box-shadow: var(--box-shadow-active);
        }
      </style>
      <button class="add-new" on-click="_createPlaylist">
        Create<paper-ripple></paper-ripple>
      </button>
      <div class="content-grid">
        <!-- <div
          data-action="open"
          data-playlist="all"
          class="card playlist-card"
          on-click="_playlistClick"
        >
          <div
            data-action="open"
            data-playlist="all"
            class="playlist-length"
          >
            [[tracks.length]]
          </div>
          <div
            data-action="open"
            data-playlist="all"
            class="playlist-card-content all-tracks"
          >
            <p
              data-action="open"
              data-playlist="all"
              class="playlist-title"
            >
              All Tracks
            </p>
          </div>
          <paper-ripple></paper-ripple>
        </div> -->
        <template is="dom-repeat" items="[[playlists]]" as="playlist">
          <div
            data-action="open"
            data-playlist$="[[playlist.id]]"
            class$="card playlist-card[[_isYourPlaylist(user.id, playlist.user.id)]]"
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
                [[playlist.name]]
              </p>
              <p
                data-action="open"
                data-playlist$="[[playlist.id]]"
                class="playlist-author"
              >
                by [[playlist.user.username]]
              </p>
            </div>
            <template is="dom-if" if="[[_equals(user.id, playlist.user.id)]]">
              <button
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
              </button>
            </template>
            <paper-ripple></paper-ripple>
          </div>
        </template>
      </div>
      <template is="dom-if" if="[[optionsPlaylist]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-header">
              <p class="modal-title">[[optionsPlaylist.name]]</p>
              <p class="modal-subtitle">by [[optionsPlaylist.user.username]]</p>
            </div>
            <div class="modal-content">
              <button data-action="removePlaylist" class="modal-option">
                Remove playlist<paper-ripple></paper-ripple>
              </button>
            </div>
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[create]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-input-content">
              <p class="modal-title">Create Playlist</p>
              <paper-input
                type="text"
                label="Name"
                value="{{playlist.name}}"
              ></paper-input>
              <button data-action="createPlaylist" class="create-playlist">
                Create<paper-ripple></paper-ripple>
              </button>
            </div>
          </div>
        </div>
      </template>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      },
      tracks: Array,
      playlists: Array,
      playlist: {
        type: Object,
        value: {
          name: ""
        }
      },
      create: {
        type: Boolean,
        value: false
      },
      optionsPlaylist: Object,
      user: Object
    };
  }

  _activeChanged(active) {
    if (active) {
      window.dispatchEvent(
        new CustomEvent("get-playlists", {
          detail: {}
        })
      );
    }
  }

  _isYourPlaylist(id, owner) {
    return id === owner ? " yours" : "";
  }

  _equals(value, check) {
    return value === check;
  }

  _onDown(e) {
    // disable the ripple of the parent element
    e.stopPropagation();
  }

  _createPlaylist() {
    this.set("create", true);
  }

  _modalClick(e) {
    if (e.target.dataset.action) {
      switch (e.target.dataset.action) {
        case "removePlaylist":
          window.dispatchEvent(
            new CustomEvent("remove-playlist", {
              detail: {
                playlist: this.get("optionsPlaylist").id
              }
            })
          );
          this.set("optionsPlaylist", null);
          break;
        case "createPlaylist":
          window.dispatchEvent(
            new CustomEvent("create-playlist", {
              detail: {
                name: this.get("playlist").name
              }
            })
          );
          this.set("create", false);
          this.set("playlist.name", "");
          break;
        case "close":
          this.set("optionsPlaylist", null);
          this.set("create", false);
          break;
      }
    }
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
        this.set("optionsPlaylist", playlist);
        break;
    }
  }
}

window.customElements.define("playlists-page", PlaylistsPage);
