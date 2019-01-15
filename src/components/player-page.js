import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "../style/shared-styles.js";

class PlayerPage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .content-grid {
          display: grid;
          width: 100%;
          height: 100%;
          padding: 16px;
          grid-template-columns: 100%;
          grid-template-rows: 1fr 1fr;
          grid-row-gap: 16px;
          box-sizing: border-box;
        }

        .disc {
          width: 216px;
          height: 216px;
          border-radius: 50%;
          box-shadow: var(--box-shadow), 0 0 0 32px rgba(0, 0, 0, 0.05),
            0 0 0 64px rgba(0, 0, 0, 0.05);
          background-color: #fff;
          object-fit: cover;
          align-self: end;
          justify-self: center;
        }

        .play {
          padding: 16px;
        }

        .controls {
          display: grid;
          width: 280px;
          margin: 16px auto;
          grid-template-columns: 1fr 1fr auto 1fr 1fr;
          grid-template-rows: 1fr;
          grid-column-gap: 16px;
          justify-items: center;
          align-items: center;
        }

        .progress-container {
          display: grid;
          width: 100%;
          max-width: 640px;
          height: 18px;
          margin: auto;
          grid-template-columns: 32px 1fr 32px;
          grid-template-rows: 1fr;
          grid-column-gap: 8px;
          justify-items: center;
          align-items: center;
        }

        .progress-bar-container {
          width: 100%;
          height: 2px;
          padding: 8px 0px;
        }

        .time {
          font-size: 12px;
          color: #757575;
        }

        .info {
          width: 100%;
          align-self: center;
          justify-self: center;
        }

        .ripple {
          color: var(--active-color);
        }

        .ripple.active {
          color: #757575;
        }

        .icon-button.active {
          color: var(--active-color);
        }
      </style>
      <div class="content-grid">
        <img class="disc" src="[[_getCoverArt(player.track.art)]]" />
        <div class="info">
          <p class="title">[[player.track.title]]</p>
          <p class="subtitle">[[player.track.artist]]</p>
          <div class="progress-container">
            <div class="time">
              [[_convertTime(player.state.position)]]
            </div>
            <div id="progress" class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class$="progress[[_active(player.state.playing)]]"
                  style$="width: [[_getProgress(player.state.position, player.track.duration)]]%;"
                ></div>
              </div>
            </div>
            <div class="time">[[_convertTime(player.track.duration)]]</div>
          </div>
          <div class="controls">
            <button
              class$="icon-button[[_active(player.state.shuffle)]]"
              on-click="_shuffle"
            >
              <iron-icon icon="shuffle"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(player.state.shuffle)]]"
                center
              ></paper-ripple>
            </button>
            <button class="fab" on-click="_previousTrack">
              <iron-icon icon="previous-track"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button class="fab play" on-click="_playPause">
              <iron-icon icon$="[[_getIcon(player.state.paused)]]"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button class="fab" on-click="_nextTrack">
              <iron-icon icon="next-track"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button
              class$="icon-button[[_active(player.state.repeat)]]"
              on-click="_repeat"
            >
              <iron-icon icon="repeat"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(player.state.repeat)]]"
                center
              ></paper-ripple>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      },
      player: Object
    };
  }

  static get observers() {
    return ["_trackChanged(player.track)"];
  }

  _activeChanged(active) {
    if (active) {
      console.log(active);
    }
  }

  _trackChanged(track) {
    if (this.active && !track) {
      window.dispatchEvent(
        new CustomEvent("set-path", {
          detail: { path: "/tracks", history: [] }
        })
      );
    }
  }

  _active(active) {
    return active ? " active" : "";
  }

  _convertTime(time) {
    if (time) {
      let minutes = time % 60;
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${Math.floor(time / 60)}:${minutes}`;
    } else {
      return "0:00";
    }
  }

  _getProgress(time, total) {
    return (time * 100) / total || 0;
  }

  _getIcon(paused) {
    return paused ? "play" : "pause";
  }

  _getCoverArt(coverArt) {
    return coverArt || "../../assets/images/icons/default_cover_art.svg";
  }

  _shuffle() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "shuffle" }
      })
    );
  }

  _repeat() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "repeat" }
      })
    );
  }

  _previousTrack() {
    window.dispatchEvent(new CustomEvent("previous-track", { detail: {} }));
  }

  _nextTrack() {
    window.dispatchEvent(new CustomEvent("next-track", { detail: {} }));
  }

  _playPause() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "playing" }
      })
    );
  }
}

window.customElements.define("player-page", PlayerPage);
