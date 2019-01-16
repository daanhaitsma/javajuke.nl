import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import {
  setPassiveTouchGestures,
  setRootPath
} from "@polymer/polymer/lib/utils/settings.js";
import { vhCheck } from "../utils/viewportHeightCheck.js";
import { addOfflineListener } from "../utils/offlineListener.js";
import * as cookieHelper from "../utils/cookieHelper.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/paper-toast/paper-toast.js";
import "./bottom-bar.js";
import "../api/repository-auth.js";
import "../api/repository-tracks.js";
import "../api/repository-playlists.js";
import "../api/repository-player.js";
import "../style/shared-styles.js";

class AppShell extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
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
        .toast {
          border-radius: 16px;
          color: white;
          background-color: var(--active-color);
        }
        .toast.error {
          background-color: #B71C1C;
        }
      </style>
      <repository-auth id="repositoryAuth"></repository-auth>
      <repository-tracks id="repositoryTracks"></repository-tracks>
      <repository-playlists id="repositoryPlaylists"></repository-playlists>
      <repository-player id="repositoryPlayer"></repository-player>
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
          <tracks-page
            name="tracks"
            user="[[user]]"
            player="[[player]]"
            tracks="[[tracks]]"
            playlists="[[playlists]]"
            active="[[_isActive(page, 'tracks')]]"
          ></tracks-page>
          <search-page
            name="search"
            user="[[user]]"
            player="[[player]]"
            search-tracks="[[searchTracks]]"
            playlists="[[playlists]]"
            active="[[_isActive(page, 'search')]]"
          ></search-page>
          <playlists-page
            name="playlists"
            tracks="[[tracks]]"
            playlists="[[playlists]]"
            user="[[user]]"
            active="[[_isActive(page, 'playlists')]]"
          ></playlists-page>
          <playlist-page
            name="playlist"
            player="[[player]]"
            playlist="[[playlist]]"
            user="[[user]]"
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
        <paper-toast
          id="successToast"
          class="toast"
          text="[[successsuccessToastMessage]]"
          on-click="_closeSuccessToast"
        ></paper-toast>
        <paper-toast
          id="errorToast"
          class="toast error"
          text="[[errorToastMessage]]"
          on-click="_closeErrorToast"
        ></paper-toast>
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
            repeat: false,
            time: 0
          }
        }
      },
      tracks: Array,
      playlists: Array,
      playlist: Object,
      searchTracks: Array,
      user: Object,
      playerInterval: Object,
      stateInterval: Object,
      successToastMessage: String,
      errorToastMessage: String
    };
  }

  static get observers() {
    return [
      "_routePageChanged(routeData.page)",
      "_playingChanged(player.state.playing)"
    ];
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

    // this.set(
    //   "stateInterval",
    //   setInterval(() => {
    //     this._getState();
    //   }, 2000)
    // );

    window.addEventListener("set-path", e =>
      this._setPath(e.detail.path, e.detail.history)
    );

    window.addEventListener("set-track", e => this._setTrack(e.detail.track));
    window.addEventListener("play-playlist", e =>
      this._playPlaylist(e.detail.playlist)
    );
    window.addEventListener("next-track", () => this._nextTrack());
    window.addEventListener("previous-track", () => this._previousTrack());
    window.addEventListener("toggle-state", e =>
      this._toggleState(e.detail.state)
    );
    window.addEventListener("get-tracks", () => this._getTracks());
    window.addEventListener("search-tracks", e =>
      this._searchTracks(e.detail.search)
    );
    window.addEventListener("delete-track", e =>
      this._deleteTrack(e.detail.track)
    );
    window.addEventListener("get-playlists", () => this._getPlaylists());
    window.addEventListener("create-playlist", e =>
      this._createPlaylist(e.detail.name)
    );
    window.addEventListener("get-playlist", e =>
      this._getPlaylist(e.detail.playlist)
    );
    window.addEventListener("remove-playlist", e =>
      this._removePlaylist(e.detail.playlist)
    );
    window.addEventListener("remove-from-playlist", e =>
      this._removeFromPlaylist(e.detail.playlist, e.detail.track)
    );
    window.addEventListener("add-to-playlist", e =>
      this._addToPlaylist(e.detail.playlist, e.detail.track)
    );
    window.addEventListener("login-user", e =>
      this._login(e.detail.username, e.detail.password)
    );
  }

  _closeSuccessToast() {
    this.$.successToast.close();
  }

  _closeErrorToast() {
    this.$.errorToast.close();
  }

  _playingChanged(playing) {
    if (playing) {
      clearInterval(this.playerInterval);
      this.set(
        "playerInterval",
        setInterval(() => {
          this._timer(this.player);
        }, 1000)
      );
    } else {
      clearInterval(this.playerInterval);
    }
  }

  _timer(player) {
    this.set("player.state.position", player.state.position + 1);
  }

  _routePageChanged(page) {
    switch (page) {
      case "":
        return;
      case "player":
        import("./player-page.js");
        break;
      case "tracks":
        import("./tracks-page.js");
        break;
      case "search":
        import("./search-page.js");
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
  }

  _getState() {
    this.$.repositoryPlayer.getState().then(result => {
      this.set("player.state", result);
    });
  }

  _toggleState(state) {
    switch (state) {
      case "playing":
        this.$.repositoryPlayer.togglePlay().then(result => {
          this.set("player.state", result);
        });
        break;
      case "shuffle":
        this.$.repositoryPlayer.toggleShuffle().then(result => {
          this.set("player.state", result);
        });
        break;
      case "repeat":
        this.$.repositoryPlayer.toggleRepeat().then(result => {
          this.set("player.state", result);
        });
        break;
    }
  }

  _previousTrack() {
    this.$.repositoryPlayer.previousTrack().then(result => {
      this.set("player.state", result);
    });
  }

  _nextTrack() {
    this.$.repositoryPlayer.nextTrack().then(result => {
      this.set("player.state", result);
    });
  }

  _playPlaylist(playlist) {
    this.$.repositoryPlayer.playPlaylist(playlist).then(result => {
      this.set("player.state", result);
    });
  }

  _getTracks() {
    this.$.repositoryTracks
      .getTracks()
      .then(result => {
        this.set("tracks", result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _searchTracks(search) {
    this.$.repositoryTracks
      .searchTracks(search)
      .then(result => {
        this.set("searchTracks", result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _deleteTrack(track) {
    this.$.repositoryTracks
      .deleteTrack(track)
      .then(() => {
        this._getTracks();
        this.set("successToastMessage", "Track was successfully deleted");
        this.$.successToast.open();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _getPlaylists() {
    this.$.repositoryPlaylists
      .getPlaylists()
      .then(result => {
        this.set("playlists", result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _createPlaylist(name) {
    this.$.repositoryPlaylists
      .createPlaylist(name)
      .then(result => {
        this._setPath(`/playlist/${result.id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _getPlaylist(playlist) {
    this.$.repositoryPlaylists
      .getPlaylist(playlist)
      .then(result => {
        this.set("playlist", result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _removePlaylist(playlist) {
    this.$.repositoryPlaylists
      .removePlaylist(playlist)
      .then(() => {
        this._getPlaylists();
        this.set("successToastMessage", "Playlist was successfully removed");
        this.$.successToast.open();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _removeFromPlaylist(playlist, track) {
    this.$.repositoryPlaylists
      .removeFromPlaylist(playlist, track)
      .then(result => {
        this.set("playlist", result);
        this.set(
          "successToastMessage",
          "Track was successfully removed from playlist"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _addToPlaylist(playlist, track) {
    this.$.repositoryPlaylists
      .addToPlaylist(playlist, track)
      .then(() => {
        this.set(
          "successToastMessage",
          "Track was successfully added to playlist"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        this.set("errorToastMessage", "Track already exists in playlist");
        this.$.errorToast.open();
        console.log(error);
      });
  }

  _login(username, password) {
    this.$.repositoryAuth
      .login("", username, password)
      .then(result => {
        cookieHelper.setCookie("auth_token", result.token, 1440);
        this.set("user", result);
        this._setPath("/tracks", []);
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
          this._setPath("/tracks", []);
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
      // if (cookieHelper.getCookie("auth_token")) {
      window.history.pushState({ history: [] }, "", "/tracks");
      // } else {
      //   window.history.pushState({ history: [] }, "", "/login");
      // }
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
