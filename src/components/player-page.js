import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "../../assets/images/icons/icon-set.js";
import "./shared-styles.js";

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
          width: 60vw;
          height: 60vw;
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
          margin: auto;
          margin-top: 16px;
          grid-template-columns: 1fr 1fr auto 1fr 1fr;
          grid-template-rows: 1fr;
          grid-column-gap: 16px;
          justify-items: center;
          align-items: center;
        }

        .progress-container {
          display: grid;
          width: 100%;
          height: 18px;
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
        <img class="disc" src="[[player.track.art]]" />
        <div class="info">
          <p class="title">[[player.track.title]]</p>
          <p class="subtitle">[[player.track.artist]]</p>
          <div class="progress-container">
            <div class="time" on-click="_restart">
              [[_convertTime(player.state.time)]]
            </div>
            <div id="progress" class="progress-bar-container" on-click="_click">
              <div class="progress-bar">
                <div
                  class$="progress[[_active(player.state.playing)]]"
                  style$="width: [[_getProgress(player.state.time, player.track.time)]]%;"
                ></div>
              </div>
            </div>
            <div class="time">[[_convertTime(player.track.time)]]</div>
          </div>
          <div class="controls">
            <div
              class$="icon-button[[_active(player.state.shuffle)]]"
              on-click="_shuffle"
            >
              <iron-icon icon="shuffle"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(player.state.shuffle)]]"
                center
              ></paper-ripple>
            </div>
            <div class="fab">
              <iron-icon icon="skip-previous"></iron-icon>
              <paper-ripple center></paper-ripple>
            </div>
            <div class="fab play" on-click="_playPause">
              <iron-icon icon$="[[_getIcon(player.state.playing)]]"></iron-icon>
              <paper-ripple center></paper-ripple>
            </div>
            <div class="fab">
              <iron-icon icon="skip-next"></iron-icon>
              <paper-ripple center></paper-ripple>
            </div>
            <div
              class$="icon-button[[_active(player.state.loop)]]"
              on-click="_loop"
            >
              <iron-icon icon="repeat"></iron-icon>
              <paper-ripple
                class$="ripple[[_active(player.state.loop)]]"
                center
              ></paper-ripple>
            </div>
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

  _activeChanged(active) {
    if (active) {
      console.log(active);
    }
  }

  _active(active) {
    return active ? " active" : "";
  }

  _convertTime(time) {
    let minutes = time % 60;
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${Math.floor(time / 60)}:${minutes}`;
  }

  _getProgress(time, total) {
    return (time * 100) / total;
  }

  _getIcon(playing) {
    return playing ? "pause" : "play";
  }

  _restart() {
    window.dispatchEvent(new CustomEvent("set-time", { detail: { time: 0 } }));
  }

  _shuffle() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "shuffle", value: !this.player.state.shuffle }
      })
    );
  }

  _loop() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "loop", value: !this.player.state.loop }
      })
    );
  }

  _playPause() {
    window.dispatchEvent(
      new CustomEvent("toggle-state", {
        detail: { state: "playing", value: !this.player.state.playing }
      })
    );
  }

  _click(e) {
    let position = e.clientX - this.$.progress.offsetLeft;
    let total = this.$.progress.offsetWidth;
    let percentage = position / total;
    window.dispatchEvent(
      new CustomEvent("set-time", {
        detail: {
          time: Math.round(this.player.track.time * percentage)
        }
      })
    );
  }
}

window.customElements.define("player-page", PlayerPage);
