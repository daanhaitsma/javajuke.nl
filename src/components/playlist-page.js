import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/app-route/app-route.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class PlaylistPage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .playlist-content {
          width: 100%;
          padding: 16px;
          box-sizing: border-box;
        }

        .playlist-play {
          position: relative;
          margin: 16px calc(50% - 64px) 0px calc(50% - 64px);
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

        .playlist-play:active {
          box-shadow: var(--box-shadow-active);
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
        .track-card.yours {
          grid-template-columns: 48px 1fr 48px;
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

      <app-route route="{{route}}" pattern="/:playlist" data="{{routeData}}">
      </app-route>

      <div class="playlist-content">
        <p class="title">[[playlist.name]]</p>
        <p class="subtitle">by [[playlist.user.username]]</p>
        <button class="playlist-play" on-click="_play">
          PLAY<paper-ripple></paper-ripple>
        </button>
      </div>
      <div class="content-grid">
        <template is="dom-repeat" items="[[playlist.tracks]]" as="track">
          <div
            data-action="play"
            data-track$="[[track.id]]"
            class$="card track-card[[_isYourPlaylist(user.id, playlist.user.id)]]"
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
            <template is="dom-if" if="[[_equals(user.id, playlist.user.id)]]">
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
            </template>
            <paper-ripple></paper-ripple>
          </div>
        </template>
      </div>
      <template is="dom-if" if="[[selected]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-header">
              <p class="modal-title">[[selected.title]]</p>
              <p class="modal-subtitle">[[selected.artist]]</p>
            </div>
            <div class="modal-content">
              <button data-action="removeFromPlaylist" class="modal-option">
                Remove track from playlist<paper-ripple></paper-ripple>
              </button>
            </div>
          </div>
        </div>
      </template>
    `;
  }
  static get properties() {
    return {
      route: Object,
      routeData: Object,
      user: Object,
      state: Object,
      playlist: Object,
      selected: Object
    };
  }

  static get observers() {
    return ["_playlistChanged(routeData.playlist)"];
  }

  _playlistChanged(playlist) {
    playlist = Number(playlist);
    if (playlist > 0) {
      window.dispatchEvent(
        new CustomEvent("get-playlist", {
          detail: {
            playlist: playlist
          }
        })
      );
    }
  }

  _equals(value, check) {
    return value === check;
  }

  _isYourPlaylist(id, owner) {
    return id === owner ? " yours" : "";
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

  _play() {
    window.dispatchEvent(
      new CustomEvent("play-playlist", {
        detail: {
          playlist: this.playlist.id
        }
      })
    );
  }

  _onDown(e) {
    // disable the ripple of the parent element
    e.stopPropagation();
  }

  _modalClick(e) {
    if (e.target.dataset.action) {
      switch (e.target.dataset.action) {
        case "addToPlaylist":
          this.set("selected", null);
          break;
        case "removeFromPlaylist":
          window.dispatchEvent(
            new CustomEvent("remove-from-playlist", {
              detail: {
                playlist: this.get("playlist").id,
                track: this.get("selected").id
              }
            })
          );
          this.set("selected", null);
          break;
        case "close":
          this.set("selected", null);
          break;
      }
    }
  }

  _trackClick(e) {
    switch (e.target.dataset.action) {
      case "play":
        if (
          (this.state.currentTrack &&
            this.state.currentTrack.id !== Number(e.target.dataset.track)) ||
          !this.state.currentTrack
        ) {
          window.dispatchEvent(
            new CustomEvent("add-to-queue", {
              detail: {
                track: this.playlist.tracks.find(item => {
                  return item.id === Number(e.target.dataset.track);
                })
              }
            })
          );
        }
        break;
      case "options":
        let track = this.playlist.tracks.find(item => {
          return item.id === Number(e.target.dataset.track);
        });
        this.set("selected", track);
        break;
    }
  }
}

window.customElements.define("playlist-page", PlaylistPage);
