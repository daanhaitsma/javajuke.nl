import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "./shared-styles.js";

class BottomBar extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .bottom-bar {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 47px;
          grid-row-gap: 16px;
          justify-items: center;
          align-items: center;
          width: 100%;
          height: 47px;
          background-color: #fff;
          border-top: 1px solid #eee;
        }

        .bottom-bar-button {
          position: relative;
          width: 100%;
          height: 47px;
          padding: 2.5px 0px;
          box-sizing: border-box;
          text-align: center;
          color: #757575;
          transition: color 0.2s ease;
        }

        .bottom-bar-button.active {
          color: var(--active-color);
        }

        .bottom-bar-title {
          font-size: 12px;
        }

        .ripple {
          color: var(--active-color);
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

        .active-track-bar {
          position: relative;
          width: 100%;
          height: 0;
          background-color: #fff;
          color: #757575;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 2px 1fr;
          transition: height 0.2s ease-in-out;
        }

        @media screen and (min-width: 640px) {
          .bottom-bar {
            width: 640px;
            padding-left: calc(50vw - 320px);
            padding-right: calc(50vw - 320px);
          }
          .active-track-content {
            padding-left: calc(50vw - 320px);
            padding-right: calc(50vw - 320px);
          }
        }

        .active-track-bar.active {
          height: 48px;
        }

        .active-track-content {
          width: 100%;
          height: 46px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 48px 1fr 48px;
          grid-template-rows: 1fr;
          grid-row-gap: 8px;
          align-items: center;
          justify-items: center;
        }
        .active-track-disc {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #eee;
          object-fit: cover;
          border: 1px solid #bdbdbd;
          box-sizing: border-box;
        }
        .active-track-info {
          width: 100%;
          height: 42px;
          padding: 2px 0px;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 24px 18px;
          align-items: center;
        }
        .active-track-title {
          text-align: center;
          font-weight: bold;
          color: #757575;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .active-track-artist {
          text-align: center;
          font-size: 12px;
          color: #bdbdbd;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <div
        data-action="player"
        class$="active-track-bar[[_showActive(page, player.track)]]"
        on-click="_activeTrackClick"
      >
        <div data-data-action="player" class="progress-bar">
          <div
            data-action="player"
            class$="progress[[_active(player.state.playing)]]"
            style$="width: [[_getProgress(player.state.time, player.track.time)]]%;"
          ></div>
        </div>
        <div data-action="player" class="active-track-content">
          <img
            data-action="player"
            class="active-track-disc"
            src="[[_getCoverArt(player.track.art)]]"
          />
          </template>
          <div data-action="player" class="active-track-info">
            <p data-action="player" class="active-track-title">
              [[player.track.title]]
            </p>
            <p data-action="player" class="active-track-artist">
              [[player.track.artist]]
            </p>
          </div>
          <div data-action="playPause" class="icon-button" on-down="_onDown">
            <iron-icon
              data-action="playPause"
              icon$="[[_getIcon(player.state.playing)]]"
            ></iron-icon>
            <paper-ripple center></paper-ripple>
          </div>
        </div>
        <paper-ripple></paper-ripple>
      </div>

      <div class="bottom-bar">
        <div
          class$="bottom-bar-button[[_activePage('home', page)]]"
          on-click="_home"
        >
          <iron-icon icon="home"></iron-icon>
          <p class="bottom-bar-title">Home</p>
          <paper-ripple class="ripple" center></paper-ripple>
        </div>
        <div
          class$="bottom-bar-button[[_activePage('playlists', page)]]"
          data-path="/playlists"
          on-click="_navigate"
        >
          <iron-icon data-path="/playlists" icon="folder"></iron-icon>
          <p data-path="/playlists" class="bottom-bar-title">Playlists</p>
          <paper-ripple
            data-path="/playlists"
            class="ripple"
            center
          ></paper-ripple>
        </div>
        <div class$="bottom-bar-button[[_activePage('account, page')]]">
          <iron-icon icon="account"></iron-icon>
          <p class="bottom-bar-title">Account</p>
          <paper-ripple class="ripple" center></paper-ripple>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      page: String,
      player: Object
    };
  }

  _activePage(page, activePage) {
    return page === activePage ? " active" : "";
  }

  _showActive(page, activeTrack) {
    let pages = ["home", "playlists", "playlist"];
    return pages.includes(page) && activeTrack ? " active" : "";
  }

  _getProgress(time, total) {
    return (time * 100) / total || 0;
  }

  _getIcon(playing) {
    return playing ? "pause" : "play";
  }

  _getCoverArt(coverArt) {
    return coverArt || "../../assets/images/icons/default_cover_art.svg";
  }

  _active(active) {
    return active ? " active" : "";
  }

  _onDown(e) {
    // disable the ripple of the parent element
    e.stopPropagation();
  }

  _home() {
    window.dispatchEvent(
      new CustomEvent("set-path", {
        detail: { path: "/home", history: [] }
      })
    );
  }

  _navigate(e) {
    window.dispatchEvent(
      new CustomEvent("set-path", {
        detail: { path: e.target.dataset.path, history: ["/home"] }
      })
    );
  }

  _activeTrackClick(e) {
    switch (e.target.dataset.action) {
      case "player":
        window.dispatchEvent(
          new CustomEvent("set-path", { detail: { path: "/player" } })
        );
        break;
      case "playPause":
        window.dispatchEvent(
          new CustomEvent("toggle-state", {
            detail: { state: "playing", value: !this.player.state.playing }
          })
        );
    }
  }
}

window.customElements.define("bottom-bar", BottomBar);
