import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import {
  setPassiveTouchGestures,
  setRootPath
} from "@polymer/polymer/lib/utils/settings.js";
import { vhCheck } from "../utils/viewportHeightCheck.js";
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
    // Create a custom history
    this._setupHistory();
    // Check the auth_token
    this._checkAuth();
    // Check the viewport height
    vhCheck();

    // Add an eventListener for navigation requests
    window.addEventListener("set-path", e =>
      this._setPath(e.detail.path, e.detail.history)
    );
    // Add an eventListener for play playlist requests
    window.addEventListener("play-playlist", e =>
      this._playPlaylist(e.detail.playlist)
    );
    // Add an eventListener for next track requests
    window.addEventListener("next-track", () => this._nextTrack());
    // Add an eventListener for previous track requests
    window.addEventListener("previous-track", () => this._previousTrack());
    // Add an eventListener for toggle requests
    window.addEventListener("toggle-state", e =>
      this._toggleState(e.detail.state)
    );
    // Add an eventListener for volume change requests
    window.addEventListener("set-volume", e =>
      this._setVolume(e.detail.volume)
    );
    // Add an eventListener for add to queue requests
    window.addEventListener("add-to-queue", e =>
      this._addToQueue(e.detail.track)
    );
    // Add an eventListener for track list requests
    window.addEventListener("get-tracks", () => this._getTracks());
    // Add an eventListener for search tracks requests
    window.addEventListener("search-tracks", e =>
      this._searchTracks(e.detail.search)
    );
    // Add an eventListener for upload tracks requests
    window.addEventListener("upload-tracks", e =>
      this._uploadTracks(e.detail.files)
    );
    // Add an eventListener for delete tracks requests
    window.addEventListener("delete-track", e =>
      this._deleteTrack(e.detail.track, e.detail.search)
    );
    // Add an eventListener for sync tracks requests
    window.addEventListener("sync-tracks", () => this._syncTracks());
    // Add an eventListener for playlist list requests
    window.addEventListener("get-playlists", () => this._getPlaylists());
    // Add an eventListener for create playlist requests
    window.addEventListener("create-playlist", e =>
      this._createPlaylist(e.detail.name)
    );
    // Add an eventListener for get playlist requests
    window.addEventListener("get-playlist", e =>
      this._getPlaylist(e.detail.playlist)
    );
    // Add an eventListener for remove playlist requests
    window.addEventListener("remove-playlist", e =>
      this._removePlaylist(e.detail.playlist)
    );
    // Add an eventListener for remove track from playlist requests
    window.addEventListener("remove-from-playlist", e =>
      this._removeFromPlaylist(e.detail.playlist, e.detail.track)
    );
    // Add an eventListener for add track to playlist requests
    window.addEventListener("add-to-playlist", e =>
      this._addToPlaylist(e.detail.playlist, e.detail.track)
    );
    // Add an eventListener for login requests
    window.addEventListener("login-user", e =>
      this._login(e.detail.username, e.detail.password)
    );
    // Add an eventListener for registration requests
    window.addEventListener("register-user", e =>
      this._register(e.detail.username, e.detail.email, e.detail.password)
    );
    // Add an eventListener for logout requests
    window.addEventListener("logout-user", () => this._logout());
  }

  _closeSuccessToast() {
    // Close the toast on click
    this.$.successToast.close();
  }

  _closeErrorToast() {
    // Close the toast on click
    this.$.errorToast.close();
  }

  _playingChanged(playing) {
    // Check if playing
    if (playing) {
      // If so clear the current interval and start a new one
      clearInterval(this.playerInterval);
      this.set(
        "playerInterval",
        setInterval(() => {
          this._timer(this.state);
        }, 1000)
      );
    } else {
      // Else just clear the current interval
      clearInterval(this.playerInterval);
    }
  }

  _userChanged(user) {
    // Check if a user is logged in
    if (user) {
      // If so clear the current interval and start a new one
      clearInterval(this.stateInterval);
      this.set(
        "stateInterval",
        setInterval(() => {
          this._getState();
        }, 2000)
      );
    } else {
      // Else just clear the current interval
      clearInterval(this.stateInterval);
    }
  }

  _timer(state) {
    // If the player time is lower than the track duration add 1 second
    if (state.currentTrack.duration > state.position) {
      this.set("state.position", state.position + 1);
    }
  }

  _routePageChanged(page) {
    // Load the selected page
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
    // Fade the current page out
    this.$.page.classList.add("hidden");
    // After 0.2 seconds fase in the new page
    setTimeout(() => {
      this.set("page", page);
      this.$.page.classList.remove("hidden");
    }, 200);
  }

  _setPath(path, history) {
    // Check if the path is not the current route path
    if (path !== this.route.path) {
      // If not check if there is a history
      if (history) {
        // If so set the custom site history
        this.set("history", history);
      } else {
        // Else add the current route path to the custom history
        this.push("history", this.route.path);
      }
      // Replace the browsers history state
      window.history.replaceState({ history: this.get("history") }, "", path);
      // Send an location changed event so app route can detect a route change
      window.dispatchEvent(new CustomEvent("location-changed"));
    }
  }

  _logout() {
    // Start an logout request
    this.$.repositoryAuth.logout();
    // Clear the user
    this.set("user", null);
    // Clear the auth_token cookie
    cookieHelper.removeCookie("auth_token");
    // Navigate to the login page
    this._setPath(`/login`, []);
  }

  _addToQueue(track) {
    // Start an add to queue request
    this.$.repositoryPlayer
      .addToQueue(track.id)
      .then(result => {
        // Set the player state
        this.set("state", result);
        // Show an succes toast
        this.set(
          "successToastMessage",
          "Track was successfully added to queue"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
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
    // Start an get state request
    this.$.repositoryPlayer
      .getState()
      .then(result => {
        // Set the player state
        this.set("state", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an volume change request
    this.$.repositoryPlayer
      .setVolume(volume)
      .then(result => {
        // Set the player state
        this.set("state", result);
      })
      .catch(error => {
        // Check the error response
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
        // Start an play/pause request
        this.$.repositoryPlayer
          .togglePlay()
          .then(result => {
            // Set the player state
            this.set("state", result);
          })
          .catch(error => {
            // Check the error response
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
        // Start an shuffle request
        this.$.repositoryPlayer
          .toggleShuffle()
          .then(() => {})
          .catch(error => {
            // Check the error response
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
        // Start an repeat request
        this.$.repositoryPlayer
          .toggleRepeat()
          .then(result => {
            // Set the player state
            this.set("state", result);
          })
          .catch(error => {
            // Check the error response
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
    // Start an previous track request
    this.$.repositoryPlayer
      .previousTrack()
      .then(() => {})
      .catch(error => {
        // Check the error response
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
    // Start an next track request
    this.$.repositoryPlayer
      .nextTrack()
      .then(() => {})
      .catch(error => {
        // Check the error response
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
    // Start an play playlist request
    this.$.repositoryPlayer
      .playPlaylist(playlist)
      .then(result => {
        // Set the player state
        this.set("state", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an get tracks request
    this.$.repositoryTracks
      .getTracks()
      .then(result => {
        // Set the tracks list
        this.set("tracks", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an upload tracks request
    this.$.repositoryTracks
      .uploadTracks(files)
      .then(() => {
        // Get all the tracks
        this._getTracks();
        // Open an success toast
        this.set("successToastMessage", "Tracks where successfully uploaded");
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
        if (error.response) {
          switch (error.response.code) {
            case 401:
              this._logout();
              break;
            case 400:
              // Show an error toast
              this.set(
                "errorToastMessage",
                "Tracks artist or title is missing"
              );
              this.$.errorToast.open();
              break;
          }
        } else {
          this._logout();
        }
      });
  }

  _syncTracks() {
    // Start an sync tracks request
    this.$.repositoryTracks
      .syncTracks()
      .then(() => {
        // Get all the tracks
        this._getTracks();
        // Open an success toast
        this.set("successToastMessage", "Tracks where successfully synced");
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
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
    // Start an search tracks request
    this.$.repositoryTracks
      .searchTracks(search)
      .then(result => {
        // Set the search result tracks
        this.set("searchTracks", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an delete track request
    this.$.repositoryTracks
      .deleteTrack(track)
      .then(() => {
        // Check if the delete was started with an search active
        if (search !== undefined) {
          // If so update the search result
          this._searchTracks(search);
        }
        // Get all tracks
        this._getTracks();
        // Open an success toast
        this.set("successToastMessage", "Track was successfully deleted");
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
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
    // Start an get playlists request
    this.$.repositoryPlaylists
      .getPlaylists()
      .then(result => {
        // Set all playlists
        this.set("playlists", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an create playlist request
    this.$.repositoryPlaylists
      .createPlaylist(name)
      .then(result => {
        // Navigate to the created playlist
        this._setPath(`/playlist/${result.id}`);
      })
      .catch(error => {
        // Check the error response
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
    // Start an get playlist request
    this.$.repositoryPlaylists
      .getPlaylist(playlist)
      .then(result => {
        // Set requested the playlist
        this.set("playlist", result);
      })
      .catch(error => {
        // Check the error response
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
    // Start an remove playlist request
    this.$.repositoryPlaylists
      .removePlaylist(playlist)
      .then(() => {
        // Get all playlists
        this._getPlaylists();
        // Open an success toast
        this.set("successToastMessage", "Playlist was successfully removed");
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
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
    // Start an remove track from playlist request
    this.$.repositoryPlaylists
      .removeFromPlaylist(playlist, track)
      .then(result => {
        // Update the playlist
        this.set("playlist", result);
        // Open an success toast
        this.set(
          "successToastMessage",
          "Track was successfully removed from playlist"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
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
    // Start an add track to playlist request
    this.$.repositoryPlaylists
      .addToPlaylist(playlist, track)
      .then(() => {
        // Open an success toast
        this.set(
          "successToastMessage",
          "Track was successfully added to playlist"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
        if (error.response) {
          switch (error.response.code) {
            case 400:
              // Show an error toast
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
    // Start an login request
    this.$.repositoryAuth
      .login(username, password)
      .then(result => {
        // Set the auth_token cookie
        cookieHelper.setCookie("auth_token", result.token, 10080);
        // Set the user
        this.set("user", result);
        // Navigate to the queue page
        this._setPath("/home", []);
      })
      .catch(error => {
        // Check the error response
        if (error.response) {
          switch (error.response.code) {
            case 404:
              // Show an error toast
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
    // Start an registration request
    this.$.repositoryAuth
      .register(email, username, password)
      .then(result => {
        // Navigate back to login
        this._setPath("/login", []);
        // Open an success toast
        this.set(
          "successToastMessage",
          "You have successfully registered your account"
        );
        this.$.successToast.open();
      })
      .catch(error => {
        // Check the error response
        if (error.response) {
          switch (error.response.code) {
            case 404:
              // Show an error toast
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
    // Check if the auth_token cookie exists
    if (cookieHelper.getCookie("auth_token")) {
      // If so try to request the users data
      this.$.repositoryAuth
        .getUser()
        .then(result => {
          // Set the user
          this.set("user", result);
          // Navigate to the queue page
          this._setPath("/home", []);
        })
        .catch(error => {
          // Check the error response
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
      // Else navigate to the login page
      this._setPath("/login", []);
    }
  }

  _isActive(activePage, page) {
    // return if the page is the active page
    return activePage === page;
  }

  _setupHistory() {
    // Check if there is an browser history
    if (window.history.state === null) {
      // If not check if there is an auth_token
      if (cookieHelper.getCookie("auth_token")) {
        // If so push an browser history state with the queue page
        window.history.pushState({ history: [] }, "", "/home");
      } else {
        // Else push an browser history state with the login page
        window.history.pushState({ history: [] }, "", "/login");
      }
      // Send an location changed event to show app-route the route has changed
      window.dispatchEvent(new CustomEvent("location-changed"));
    } else {
      // If there is an browser history set the custom history
      this.set("history", window.history.state.history);
    }
    // After 0.1 second add an popstate listener (the 0.1 second makes sure it does not fire to early)
    setTimeout(() => {
      window.addEventListener("popstate", e => this._popstate(e));
    }, 100);
  }

  _popstate() {
    // Check if there is an custom history
    if (this.history.length > 0) {
      // If so get the previous page from the custom history
      let lastPage = this.pop("history");
      // Push the previous page to the browsers history state
      window.history.pushState({ history: this.get("history") }, "", lastPage);
      // Send an location changed event to show app-route the route has changed
      window.dispatchEvent(new CustomEvent("location-changed"));
    } else {
      // Else exit the site
      window.history.back();
    }
  }
}

window.customElements.define("app-shell", AppShell);
