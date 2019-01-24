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

        .volume {
          position: fixed;
          top: 16px;
          right: 16px;
        }

        .set-volume {
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
        .set-volume:active {
          box-shadow: var(--box-shadow-active);
        }
        .volume-slider {
          margin-top: 8px;
          width: 100%;
        }

        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 16px;
          border-radius: 8px;
          background: #eee;
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--active-color);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--active-color);
          cursor: pointer;
        }
      </style>
      <div class="content-grid">
        <img
          class="disc"
          src="[[_getCoverArt(state.currentTrack.album.coverPath)]]"
        />
        <div class="info">
          <p class="title">[[state.currentTrack.title]]</p>
          <p class="subtitle">[[state.currentTrack.artist]]</p>
          <div class="progress-container">
            <div class="time">[[_convertTime(state.position)]]</div>
            <div id="progress" class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class$="progress[[_active(state.playing)]]"
                  style$="width: [[_getProgress(state.position, state.currentTrack.duration)]]%;"
                ></div>
              </div>
            </div>
            <div class="time">
              [[_convertTime(state.currentTrack.duration)]]
            </div>
          </div>
          <div class="controls">
            <button
              class$="icon-button[[_active(state.shuffle)]]"
              on-click="_shuffle"
            >
              <iron-icon icon="shuffle"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(state.shuffle)]]"
                center
              ></paper-ripple>
            </button>
            <button class="fab" on-click="_previousTrack">
              <iron-icon icon="previous-track"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button class="fab play" on-click="_playPause">
              <iron-icon icon$="[[_getIcon(state.paused)]]"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button class="fab" on-click="_nextTrack">
              <iron-icon icon="next-track"></iron-icon>
              <paper-ripple center></paper-ripple>
            </button>
            <button
              class$="icon-button[[_active(state.repeat)]]"
              on-click="_repeat"
            >
              <iron-icon icon="repeat"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(state.repeat)]]"
                center
              ></paper-ripple>
            </button>
          </div>
        </div>
      </div>
      <button class="icon-button volume" on-click="_volume">
        <iron-icon icon="volume"></iron-icon>
        <paper-ripple class="ripple active" center></paper-ripple>
      </button>
      <template is="dom-if" if="[[volumeControl]]">
        <div data-action="close" class="overlay" on-click="_modalClick">
          <div class="card card-modal">
            <div class="modal-input-content">
              <p class="modal-title">Volume Control</p>
              <div class="volume-slider">
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="100"
                  value="[[state.volume]]"
                  class="slider"
                  on-change="_volumeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    `;
  }
  static get properties() {
    return {
      state: Object,
      active: Boolean,
      volumeControl: {
        type: Boolean,
        value: false
      },
      volume: Number
    };
  }

  static get observers() {
    return ["_trackChanged(state.currentTrack)"];
  }

  _trackChanged(track) {
    // Check if the player page is active and there is a track playing
    if (this.active && !track) {
      // If active but no track playing send an navigation event to the app-shell to leave the player page
      window.dispatchEvent(
        new CustomEvent("set-path", {
          detail: { path: "/tracks", history: [] }
        })
      );
    }
  }

  _active(active) {
    // Return active if true
    return active ? " active" : "";
  }

  _convertTime(time) {
    // Check if it has time
    if (time) {
      // Get the minutes
      let minutes = time % 60;
      // Check if minutes is smaller than 10
      if (minutes < 10) {
        // If so add a 0 in front of it
        minutes = `0${minutes}`;
      }
      // Return the time
      return `${Math.floor(time / 60)}:${minutes}`;
    } else {
      // Else return 0:00
      return "0:00";
    }
  }

  _getProgress(time, total) {
    // Return the progress of the time
    return (time * 100) / total || 0;
  }

  _getIcon(paused) {
    // Return play or pause
    return paused ? "play" : "pause";
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

  _shuffle() {
    // Send an shuffle event to the app-shell
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "shuffle" }
      })
    );
  }

  _repeat() {
    // Send an repeat event to the app-shell
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "repeat" }
      })
    );
  }

  _previousTrack() {
    // Send an previous track event to the app-shell
    window.dispatchEvent(new CustomEvent("previous-track", { detail: {} }));
  }

  _nextTrack() {
    // Send an next track event to the app-shell
    window.dispatchEvent(new CustomEvent("next-track", { detail: {} }));
  }

  _playPause() {
    // Send an play/pause event to the app-shell
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "playing" }
      })
    );
  }

  _volume() {
    // Open the volume modal
    this.set("volumeControl", true);
  }

  _volumeChange(e) {
    // Send an volume change event to the app-shell containing the volume level
    window.dispatchEvent(
      new CustomEvent("set-volume", {
        detail: { volume: e.target.value }
      })
    );
  }

  _modalClick(e) {
    // Check if the clicked element has an action
    if (e.target.dataset.action) {
      switch (e.target.dataset.action) {
        case "close":
          // Close the volume modal
          this.set("volumeControl", false);
          break;
      }
    }
  }
}

window.customElements.define("player-page", PlayerPage);
