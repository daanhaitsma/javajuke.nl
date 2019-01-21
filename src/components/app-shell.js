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
          background-color: #b71c1c;
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
            state="[[state]]"
            active="[[_isActive(page, 'player')]]"
          ></player-page>
          <home-page name="home" state="[[state]]"></home-page>
          <tracks-page
            name="tracks"
            user="[[user]]"
            state="[[state]]"
            tracks="[[tracks]]"
            playlists="[[playlists]]"
            active="[[_isActive(page, 'tracks')]]"
          ></tracks-page>
          <search-page
            name="search"
            user="[[user]]"
            state="[[state]]"
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
            state="[[state]]"
            playlist="[[playlist]]"
            user="[[user]]"
            route="[[subroute]]"
          ></playlist-page>
          <settings-page name="settings"></settings-page>
          <login-page
            name="login"
            active="[[_isActive(page, 'login')]]"
          ></login-page>
          <register-page
            name="register"
            active="[[_isActive(page, 'register')]]"
          ></register-page>
          <div name="404">404</div>
        </iron-pages>
        <bottom-bar page="[[routeData.page]]" state="[[state]]"></bottom-bar>
        <paper-toast
          id="successToast"
          class="toast"
          text="[[successToastMessage]]"
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
        value: "login"
      },
      offline: {
        type: Boolean,
        value: false
      },
      state: {
        type: Object,
        value: {
          position: 0,
          volume: 100,
          shuffle: false,
          repeat: false,
          playing: false,
          paused: false,
          currentTrack: null,
          trackList: []
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
      "_playingChanged(state.playing)",
      "_userChanged(user)"
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
    window.addEventListener("set-volume", e =>
      this._setVolume(e.detail.volume)
    );
    window.addEventListener("add-to-queue", e =>
      this._addToQueue(e.detail.track)
    );
    window.addEventListener("get-tracks", () => this._getTracks());
    window.addEventListener("search-tracks", e =>
      this._searchTracks(e.detail.search)
    );
    window.addEventListener("upload-tracks", e =>
      this._uploadTracks(e.detail.files)
    );
    window.addEventListener("delete-track", e =>
      this._deleteTrack(e.detail.track, e.detail.search)
    );
    window.addEventListener("sync-tracks", () => this._syncTracks());
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
    window.addEventListener("register-user", e =>
      this._register(e.detail.username, e.detail.email, e.detail.password)
    );
    window.addEventListener("logout-user", () => this._logout());
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
          this._timer(this.state);
        }, 1000)
      );
    } else {
      clearInterval(this.playerInterval);
    }
  }

  _userChanged(user) {
    if (user) {
      clearInterval(this.stateInterval);
      this.set(
        "stateInterval",
        setInterval(() => {
          this._getState();
        }, 2000)
      );
    } else {
      clearInterval(this.stateInterval);
    }
  }

  _timer(state) {
    if (state.currentTrack.duration > state.position) {
      this.set("state.position", state.position + 1);
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
      case "settings":
        import("./settings-page.js");
        break;
      case "register":
        import("./register-page.js");
        break;
      case "login":
        import("./login-page.js");
        break;
      case "404":
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

  _logout() {
    this.set("user", null);
    cookieHelper.removeCookie("auth_token");
    this.$.repositoryAuth.logout();
    this._setPath(`/login`, []);
  }

  _addToQueue(track) {
    this.$.repositoryPlayer
      .addToQueue(track.id)
      .then(result => {
        this.set("state", result);
        this.set(
          "successToastMessage",
          "Track was successfully added to queue"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _getState() {
    this.$.repositoryPlayer
      .getState()
      .then(result => {
        this.set("state", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _setVolume(volume) {
    this.$.repositoryPlayer
      .setVolume(volume)
      .then(result => {
        this.set("state", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _toggleState(state) {
    switch (state) {
      case "playing":
        this.$.repositoryPlayer
          .togglePlay()
          .then(result => {
            this.set("state", result);
          })
          .catch(error => {
            if (error.response) {
              switch (error.response.code) {
                case 401:
                  this._logout();
                  break;
              }
            } else {
              this._logout();
            }
          });
        break;
      case "shuffle":
        this.$.repositoryPlayer
          .toggleShuffle()
          .then(result => {
            this.set("state", result);
          })
          .catch(error => {
            if (error.response) {
              switch (error.response.code) {
                case 401:
                  this._logout();
                  break;
              }
            } else {
              this._logout();
            }
          });
        break;
      case "repeat":
        this.$.repositoryPlayer
          .toggleRepeat()
          .then(result => {
            this.set("state", result);
          })
          .catch(error => {
            if (error.response) {
              switch (error.response.code) {
                case 401:
                  this._logout();
                  break;
              }
            } else {
              this._logout();
            }
          });
        break;
    }
  }

  _previousTrack() {
    this.$.repositoryPlayer
      .previousTrack()
      .then(() => {})
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _nextTrack() {
    this.$.repositoryPlayer
      .nextTrack()
      .then(() => {})
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _playPlaylist(playlist) {
    this.$.repositoryPlayer
      .playPlaylist(playlist)
      .then(result => {
        this.set("state", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _getTracks() {
    this.$.repositoryTracks
      .getTracks()
      .then(result => {
        this.set("tracks", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _uploadTracks(files) {
    this.$.repositoryTracks
      .uploadTracks(files)
      .then(() => {
        this._getTracks();
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _syncTracks() {
    this.$.repositoryTracks
      .syncTracks()
      .then(() => {
        this.set("successToastMessage", "Track where successfully synced");
        this.$.successToast.open();
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _searchTracks(search) {
    this.$.repositoryTracks
      .searchTracks(search)
      .then(result => {
        this.set("searchTracks", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _deleteTrack(track, search) {
    this.$.repositoryTracks
      .deleteTrack(track)
      .then(() => {
        if (search !== undefined) {
          this._searchTracks(search);
        }
        this._getTracks();
        this.set("successToastMessage", "Track was successfully deleted");
        this.$.successToast.open();
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _getPlaylists() {
    this.$.repositoryPlaylists
      .getPlaylists()
      .then(result => {
        this.set("playlists", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _createPlaylist(name) {
    this.$.repositoryPlaylists
      .createPlaylist(name)
      .then(result => {
        this._setPath(`/playlist/${result.id}`);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _getPlaylist(playlist) {
    this.$.repositoryPlaylists
      .getPlaylist(playlist)
      .then(result => {
        this.set("playlist", result);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
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
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
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
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
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
        if (error.response) {
          switch (error.response.code) {
            case 400:
              this.set("errorToastMessage", "Track already exists in playlist");
              this.$.errorToast.open();
              break;
            case 401:
              this._logout();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _login(username, password) {
    this.$.repositoryAuth
      .login("", username, password)
      .then(result => {
        cookieHelper.setCookie("auth_token", result.token, 1440);
        this.set("user", result);
        this._setPath("/home", []);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 404:
              this.set("errorToastMessage", "Incorrect login credentials");
              this.$.errorToast.open();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _register(username, email, password) {
    this.$.repositoryAuth
      .register(email, username, password)
      .then(result => {
        this._setPath("/login", []);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.code) {
            case 404:
              this.set("errorToastMessage", "Username of email already in use");
              this.$.errorToast.open();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _checkAuth() {
    if (cookieHelper.getCookie("auth_token")) {
      this.$.repositoryAuth
        .getUser()
        .then(result => {
          this.set("user", result);
          this._setPath("/home", []);
        })
        .catch(error => {
          if (error.response) {
            switch (error.response.code) {
              case 401:
                this._logout();
                break;
            }
          } else {
            this._logout();
          }
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
