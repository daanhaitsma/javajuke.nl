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
          box-shadow: var(--box-shadow),
            0 0 0 32px rgba(0, 0, 0, 0.05), 0 0 0 64px rgba(0, 0, 0, 0.05);
          background-color: #fff;
          object-fit: cover;
          align-self: end;
          justify-self: center;
        }

        h1 {
          text-align: center;
          color: #757575;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        h2 {
          text-align: center;
          color: #bdbdbd;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .progress-bar-container {
          display: grid;
          width: 100%;
          height: 18px;
          grid-template-columns: 32px 1fr 32px;
          grid-template-rows: 1fr;
          grid-column-gap: 8px;
          justify-items: center;
          align-items: center;
        }

        .progress-bar {
          width: 100%;
          height: 2px;
          background-color: rgba(0, 0, 0, 0.05);
        }

        .progress {
          position: relative;
          max-width: 100%;
          height: 2px;
          background-color: #757575;
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
      </style>
      <div class="content-grid">
        <img class="disc" src="[[player.track.art]]" />
        <div class="info">
          <h1>[[player.track.title]]</h1>
          <h2>[[player.track.artist]]</h2>
          <div class="progress-bar-container">
            <div class="time">[[_convertTime(player.state.time)]]</div>
            <div class="progress-bar">
              <div
                class="progress"
                style$="width: [[_getProgress(player.state.time, player.track.time)]]%;"
              ></div>
            </div>
            <div class="time">[[_convertTime(player.track.time)]]</div>
          </div>
          <div class="controls">
            <div class="icon-button">
              <iron-icon icon="shuffle"></iron-icon>
              <paper-ripple></paper-ripple>
            </div>
            <div class="fab">
              <iron-icon icon="skip-previous"></iron-icon>
              <paper-ripple></paper-ripple>
            </div>
            <div class="fab play">
              <iron-icon icon$="[[_getIcon(player.state.playing)]]"></iron-icon>
              <paper-ripple></paper-ripple>
            </div>
            <div class="fab">
              <iron-icon icon="skip-next"></iron-icon>
              <paper-ripple></paper-ripple>
            </div>
            <div class="icon-button">
              <iron-icon icon="repeat"></iron-icon>
              <paper-ripple></paper-ripple>
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
}

window.customElements.define("player-page", PlayerPage);
