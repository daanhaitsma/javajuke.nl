import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-input/paper-input.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class SearchPage extends PolymerElement {
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
        .search {
          width: calc(100% - 32px);
          max-width: 328px;
          margin: 8px auto 0px auto;
        }
        .search-icon {
          color: #757575;
          transition: color 0.2s ease;
        }
        paper-input[focused] > iron-icon.search-icon {
          color: var(--active-color);
        }
      </style>
      <paper-input
        class="search"
        type="text"
        label="Search"
        value="{{searchQuery}}"
      >
        <iron-icon class="search-icon" slot="prefix" icon="search"></iron-icon
      ></paper-input>
      <template is="dom-if" if="[[searchTracks.length]]">
        <div class="content-grid">
          <template is="dom-repeat" items="[[searchTracks]]" as="track">
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
      <template is="dom-if" if="[[!searchTracks.length]]">
        <div class="empty-list-container">
          <iron-icon class="empty-list-icon" icon="search"></iron-icon>
          <p class="empty-list-message">There are no results</p>
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
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      },
      user: Object,
      state: Object,
      searchTracks: Array,
      playlists: {
        type: Array,
        observer: "_playlistsChanged"
      },
      yourPlaylists: Array,
      optionsTrack: Object,
      playlistTrack: Object,
      searchQuery: {
        type: String,
        value: "",
        observer: "_searchQueryChanged"
      }
    };
  }

  _activeChanged(active) {
    // Check if the page is active
    if (active) {
      // Check if the search query is empty
      if (this.get("searchQuery") === "") {
        // If so do an empty search to show all the tracks
        window.dispatchEvent(
          new CustomEvent("search-tracks", {
            detail: { search: "" }
          })
        );
      } else {
        // Else set the search query to empty (this will trigger the _searchQueryChanged)
        this.set("searchQuery", "");
      }
    }
  }

  _searchQueryChanged(searchQuery) {
    // Send an search tracks event to the app-shell
    window.dispatchEvent(
      new CustomEvent("search-tracks", {
        detail: { search: searchQuery }
      })
    );
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
    // disable the ripple of the parent element
    e.stopPropagation();
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
              detail: {
                track: this.get("optionsTrack").id,
                search: this.get("searchQuery")
              }
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
              track: this.searchTracks.find(item => {
                return item.id === Number(e.target.dataset.track);
              })
            }
          })
        );
        break;
      case "options":
        // Get the clicked track
        let track = this.searchTracks.find(item => {
          return item.id === Number(e.target.dataset.track);
        });
        // Open the options modal for the click
        this.set("optionsTrack", track);
        break;
    }
  }
}

window.customElements.define("search-page", SearchPage);
