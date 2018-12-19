import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import {
  setPassiveTouchGestures,
  setRootPath
} from "@polymer/polymer/lib/utils/settings.js";
import { vhCheck } from "../utils/viewportHeightCheck.js";
import { addOfflineListener } from "../utils/offlineListener.js";
// import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "./bottom-bar.js";

class AppShell extends PolymerElement {
  static get template() {
    return html`
      <style>
        :root {
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
        }
        .content {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 49px;
        }
        .content-page {
          overflow-y: auto;
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        .hidden {
          opacity: 0;
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}">
      </app-route>

      <div class="content">
        <iron-pages
          id="page"
          class="content-page"
          selected="{{page}}"
          attr-for-selected="name"
          fallback-selection="404"
        >
          <player-page
            name="player"
            player="[[player]]"
            active="[[_isActive(page, 'player')]]"
          ></player-page>
          <home-page
            name="home"
            player="[[player]]"
            playlist="[[playlist]]"
            active="[[_isActive(page, 'home')]]"
          ></home-page>
          <div name="404">404</div>
        </iron-pages>
        <bottom-bar></bottom-bar>
      </div>
    `;
  }
  static get properties() {
    return {
      route: Object,
      routeData: Object,
      history: {
        type: Array,
        value: []
      },
      page: {
        type: String,
        value: "home"
      },
      offline: {
        type: Boolean,
        value: false
      },
      player: {
        type: Object,
        value: {
          track: {
            id: 0,
            title: "Sick Boy",
            art: "https://msprojectsound.com/images/153790132747790588.jpg",
            artist: "The Chainsmokers",
            time: 193
          },
          state: {
            playing: false,
            shuffle: false,
            loop: false,
            time: 0
          }
        }
      },
      playlist: {
        type: Array,
        value: [
          {
            id: 0,
            title: "Sick Boy",
            art: "https://msprojectsound.com/images/153790132747790588.jpg",
            artist: "The Chainsmokers",
            time: 193
          },
          {
            id: 1,
            title: "Everybody Hates Me",
            art:
              "https://images-na.ssl-images-amazon.com/images/I/51ukIAM3foL._SS500.jpg",
            artist: "The Chainsmokers",
            time: 224
          }
        ]
      }
    };
  }

  static get observers() {
    return ["_routePageChanged(routeData.page)"];
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
    setRootPath("/");
  }

  ready() {
    super.ready();

    this._setupHistory();

    vhCheck();

    addOfflineListener(offline => {
      this.set("offline", offline);
    });

    setInterval(() => {
      this._timer(this.player);
    }, 1000);

    window.addEventListener("set-path", e =>
      this._setPath(e.detail.path, e.detail.history)
    );

    window.addEventListener("set-track", e => this._setTrack(e.detail.track));
    window.addEventListener("set-time", e => this._setTime(e.detail.time));
    window.addEventListener("set-playing", e =>
      this._setPlaying(e.detail.playing)
    );
  }

  _timer(player) {
    if (player.state.playing && player.state.time < player.track.time) {
      this.set("player.state.time", player.state.time + 1);
    } else if (
      player.state.playing &&
      player.state.time === player.track.time
    ) {
      this.set("player.state.playing", false);
    }
  }

  _routePageChanged(page) {
    switch (page) {
      case "":
        return;
      case "player":
        import("./player-page.js");
        break;
      case "home":
        import("./home-page.js");
        break;
      case "404":
        // import("./404-page.js");
        break;
      default:
        this._setPath(`/404`);
        return;
    }
    this.$.page.classList.add("hidden");
    setTimeout(() => {
      this.set("page", page);
      this.$.page.classList.remove("hidden");
    }, 200);
  }

  _setPath(path, history) {
    if (path !== this.route.path) {
      if (history) {
        this.set("history", history);
      } else {
        this.push("history", this.route.path);
      }
      window.history.replaceState({ history: this.get("history") }, "", path);
      window.dispatchEvent(new CustomEvent("location-changed"));
    }
  }

  _setTrack(track) {
    this.set("player.track", track);
    this.set("player.state.playing", true);
    this.set("player.state.time", 0);
  }

  _setTime(time) {
    this.set("player.state.time", time);
  }

  _setPlaying(playing) {
    if (this.player.state.time === this.player.track.time) {
      this.set("player.state.time", 0);
    }
    this.set("player.state.playing", playing);
  }

  _isActive(activePage, page) {
    return activePage === page;
  }

  _setupHistory() {
    if (window.history.state === null) {
      window.history.pushState({ history: [] }, "", "/home");
      window.dispatchEvent(new CustomEvent("location-changed"));
    } else {
      this.set("history", window.history.state.history);
    }
    setTimeout(() => {
      window.addEventListener("popstate", e => this._popstate(e));
    }, 100);
  }

  _popstate() {
    if (this.history.length > 0) {
      let lastPage = this.pop("history");
      window.history.pushState({ history: this.get("history") }, "", lastPage);
      window.dispatchEvent(new CustomEvent("location-changed"));
    } else {
      window.history.back();
    }
  }
}

window.customElements.define("app-shell", AppShell);
