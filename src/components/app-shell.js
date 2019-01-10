import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import {
  setPassiveTouchGestures,
  setRootPath
} from "@polymer/polymer/lib/utils/settings.js";
import { vhCheck } from "../utils/viewportHeightCheck.js";
import { addOfflineListener } from "../utils/offlineListener.js";
import * as cookieHelper from "../utils/cookieHelper.js";
// import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "./bottom-bar.js";
import "../api/repository-auth.js";
import "../api/repository-tracks.js";
import "../api/repository-playlists.js";

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
          grid-template-rows: 1fr auto;
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
      <repository-auth id="repositoryAuth"></repository-auth>
      <repository-tracks id="repositoryTracks"></repository-tracks>
      <repository-playlists id="repositoryPlaylists"></repository-playlists>
      <app-location route="{{route}}"></app-location>
      <app-route
        route="{{route}}"
        pattern="/:page"
        data="{{routeData}}"
        tail="{{subroute}}"
      >
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
            tracks="[[tracks]]"
            active="[[_isActive(page, 'home')]]"
          ></home-page>
          <playlists-page
            name="playlists"
            tracks="[[tracks]]"
            playlists="[[playlists]]"
            active="[[_isActive(page, 'playlists')]]"
          ></playlists-page>
          <playlist-page
            name="playlist"
            player="[[player]]"
            playlists="[[playlists]]"
            route="[[subroute]]"
            active="[[_isActive(page, 'playlist')]]"
          ></playlist-page>
          <login-page
            name="login"
            active="[[_isActive(page, 'login')]]"
          ></login-page>
          <div name="404">404</div>
        </iron-pages>
        <bottom-bar page="[[routeData.page]]" player="[[player]]"></bottom-bar>
      </div>
    `;
  }
  static get properties() {
    return {
      route: Object,
      routeData: Object,
      subroute: Object,
      history: {
        type: Array,
        value: []
      },
      page: {
        type: String,
        value: ""
      },
      offline: {
        type: Boolean,
        value: false
      },
      player: {
        type: Object,
        value: {
          track: null,
          state: {
            playing: false,
            shuffle: false,
            loop: false,
            time: 0
          }
        }
      },
      tracks: Array,
      playlists: Array,
      user: Object
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
    this._checkAuth();

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
    window.addEventListener("toggle-state", e =>
      this._toggleState(e.detail.state, e.detail.value)
    );
    window.addEventListener("login-user", e =>
      this._login(e.detail.username, e.detail.password)
    );
  }

  _timer(player) {
    if (player.state.playing && player.state.time < player.track.duration) {
      this.set("player.state.time", player.state.time + 1);
    } else if (
      player.state.playing &&
      player.state.time === player.track.duration
    ) {
      this.set("player.state.playing", false);
      this.set("player.track", null);
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
      case "playlists":
        import("./playlists-page.js");
        break;
      case "playlist":
        import("./playlist-page.js");
        break;
      case "login":
        import("./login-page.js");
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

  _toggleState(state, value) {
    if (
      state === "playing" &&
      this.player.state.time === this.player.track.duration
    ) {
      this.set("player.state.time", 0);
    }
    this.set(`player.state.${state}`, value);
  }

  _login(username, password) {
    this.$.repositoryAuth
      .login("", username, password)
      .then(result => {
        cookieHelper.setCookie("auth_token", result.token, 1440);
        this.set("user", result);
        this._setPath("/home", []);
        this._getData();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _getData() {
    this.$.repositoryTracks
      .getTracks()
      .then(result => {
        this.set("tracks", result);
      })
      .catch(error => {
        console.log(error);
      });

    this.$.repositoryPlaylists
      .getPlaylists()
      .then(result => {
        this.set("playlists", result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _checkAuth() {
    if (cookieHelper.getCookie("auth_token")) {
      this.$.repositoryAuth
        .getUser()
        .then(result => {
          this.set("user", result);
          this._getData();
          this._setPath("/home", []);
        })
        .catch(error => {
          console.log(error);
          cookieHelper.removeCookie("auth_token");
          this._setPath("/login", []);
        });
    } else {
      this._setPath("/login", []);
    }
  }

  _isActive(activePage, page) {
    return activePage === page;
  }

  _setupHistory() {
    if (window.history.state === null) {
      if (cookieHelper.getCookie("auth_token")) {
        window.history.pushState({ history: [] }, "", "/home");
      } else {
        window.history.pushState({ history: [] }, "", "/login");
      }
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
