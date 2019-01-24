import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class TracksPage extends PolymerElement {
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
        .upload-track {
          position: relative;
          margin: 8px calc(50% - 64px) 0px calc(50% - 64px);
          width: 128px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-weight: 600;
          color: white;
          border-radius: 16px;
          background-color: var(--active-color);
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s ease;
        }
        .upload-track:active {
          box-shadow: var(--box-shadow-active);
        }
        .upload-track:disabled {
          background-color: #757575;
        }
        .track-input {
          display: inherit;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
        }
        .track-input-label {
          display: inline-block;
          cursor: pointer;
          width: 100%;
          height: 48px;
          margin-top: 8px;
          border-radius: 4px;
          line-height: 48px;
          text-align: center;
          color: white;
          background-color: var(--active-color);
          box-shadow: var(--box-shadow);
        }
      </style>
      <button class="add-new" on-click="_addTrack">
        Upload<paper-ripple></paper-ripple>
      </button>
      <template is="dom-if" if="[[tracks.length]]">
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
                src="[[_getCoverArt(track.album.coverPath)]]"
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
                  class$="track-title[[_active(track.id, state.currentTrack.id)]]"
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
              <button
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
              </button>
              <paper-ripple></paper-ripple>
            </div>
          </template>
        </div>
      </template>
      <template is="dom-if" if="[[!tracks.length]]">
        <div class="empty-list-container">
          <iron-icon class="empty-list-icon" icon="track"></iron-icon>
          <p class="empty-list-message">There are no tracks yet</p>
        </div>
      </template>
      <template is="dom-if" if="[[optionsTrack]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-header">
              <p class="modal-title">[[optionsTrack.title]]</p>
              <p class="modal-subtitle">[[optionsTrack.artist]]</p>
            </div>
            <div class="modal-content">
              <button data-action="addToPlaylist" class="modal-option">
                Add track to playlist<paper-ripple></paper-ripple>
              </button>
              <button data-action="deleteTrack" class="modal-option">
                Delete track<paper-ripple></paper-ripple>
              </button>
            </div>
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[playlistTrack]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-header">
              <p class="modal-title">Select the playlist</p>
            </div>
            <div class="modal-content">
              <template is="dom-repeat" items="[[yourPlaylists]]" as="playlist">
                <button
                  data-action="selectPlaylist"
                  data-playlist$="[[playlist.id]]"
                  class="modal-option"
                >
                  [[playlist.name]]<paper-ripple></paper-ripple>
                </button>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[add]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-input-content">
              <p class="modal-title">Upload Tracks</p>
              <input
                class="track-input"
                type="file"
                name="tracks"
                id="tracks"
                multiple
                accept="audio/mpeg"
                on-change="_filesChanged"
              />
              <template is="dom-if" if="[[!files.length]]">
                <label class="track-input-label" for="tracks">
                  <iron-icon icon="file"></iron-icon> Choose files
                </label>
              </template>
              <template is="dom-if" if="[[files.length]]">
                <label class="track-input-label" for="tracks">
                  <iron-icon icon="file"></iron-icon> [[files.length]] files
                  selected
                </label>
              </template>
              <button
                data-action="uploadTracks"
                class="upload-track"
                disabled="[[!files.length]]"
              >
                Upload<paper-ripple></paper-ripple>
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
      add: {
        type: Boolean,
        value: false
      },
      user: Object,
      state: Object,
      tracks: Array,
      playlists: {
        type: Array,
        observer: "_playlistsChanged"
      },
      files: {
        type: FileList,
        value: []
      },
      yourPlaylists: Array,
      optionsTrack: Object,
      playlistTrack: Object
    };
  }

  _activeChanged(active) {
    // Check if page is active
    if (active) {
      // If active get all tracks
      window.dispatchEvent(
        new CustomEvent("get-tracks", {
          detail: {}
        })
      );
    }
  }

  // Listen for changes in the playlists
  _playlistsChanged(playlists) {
    // Filter your playlists
    let yourPlaylists = playlists.filter(playlist => {
      return playlist.user.id === this.user.id;
    });
    // Set your playlists
    this.set("yourPlaylists", yourPlaylists);
  }

  _active(track, activeTrack) {
    // Return active if the track is the current playing track
    return track === activeTrack ? " active" : "";
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

  _onDown(e) {
    // Disable the ripple of the parent element
    e.stopPropagation();
  }

  _addTrack() {
    // Set the add variable to true to show the add track modal
    this.set("add", true);
  }

  _filesChanged(e) {
    // Set the files variable with the files currently in the file input
    this.set("files", e.target.files);
  }

  _modalClick(e) {
    // Check if the clicked element has an action
    if (e.target.dataset.action) {
      switch (e.target.dataset.action) {
        case "addToPlaylist":
          // Get all playlists in case there where changes
          window.dispatchEvent(
            new CustomEvent("get-playlists", {
              detail: {}
            })
          );
          // Save the previously clicked track to the playlist modal
          this.set("playlistTrack", this.get("optionsTrack"));
          // Close the options modal
          this.set("optionsTrack", null);
          break;
        case "deleteTrack":
          // Send an delete track event containing track id
          window.dispatchEvent(
            new CustomEvent("delete-track", {
              detail: { track: this.get("optionsTrack").id }
            })
          );
          // Close the options modal
          this.set("optionsTrack", null);
          break;
        case "close":
          // Close all modals
          this.set("optionsTrack", null);
          this.set("playlistTrack", null);
          this.set("add", false);
          break;
        case "selectPlaylist":
          // Send an add to playlist event to the app-shell containing track id and playlist id
          window.dispatchEvent(
            new CustomEvent("add-to-playlist", {
              detail: {
                playlist: e.target.dataset.playlist,
                track: this.get("playlistTrack").id
              }
            })
          );
          // Close the playlist modal
          this.set("playlistTrack", null);
          break;
        case "uploadTracks":
          // Send an upload tracks event to the app-shell containing the uploaded files
          window.dispatchEvent(
            new CustomEvent("upload-tracks", {
              detail: { files: this.get("files") }
            })
          );
          // Close the add track modal
          this.set("add", false);
          break;
      }
    }
  }

  _trackClick(e) {
    // Check if the clicked element has an action
    switch (e.target.dataset.action) {
      case "play":
        // Send an add to queue event to the app-shell containing the track
        window.dispatchEvent(
          new CustomEvent("add-to-queue", {
            detail: {
              track: this.tracks.find(item => {
                return item.id === Number(e.target.dataset.track);
              })
            }
          })
        );
        break;
      case "options":
        // Get the clicked track
        let track = this.tracks.find(item => {
          return item.id === Number(e.target.dataset.track);
        });
        // Open the options modal for the click
        this.set("optionsTrack", track);
        break;
    }
  }
}

window.customElements.define("tracks-page", TracksPage);
