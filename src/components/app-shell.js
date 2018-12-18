import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { vhCheck } from "../utils/viewportHeightCheck.js";
import { addOfflineListener } from "../utils/offlineListener.js";
// import "@polymer/polymer/lib/elements/dom-repeat.js";
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
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}">
      </app-route>

      <div class="content">
        <iron-pages
          class="content-page"
          selected="{{routeData.page}}"
          attr-for-selected="name"
          fallback-selection="404"
        >
          <player-page
            name="player"
            player="[[player]]"
            active="[[_isActive(routeData.page, 'player')]]"
          ></player-page>
          <!--
            <edit-page
              name="edit"
              active="[[_isActive(routeData.page, 'edit')]]"
            ></edit-page>
          -->
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
      offline: {
        type: Boolean,
        value: false
      },
      player: {
        type: Object,
        value: {
          track: {
            title: "Sick Boy",
            art: "https://msprojectsound.com/images/153790132747790588.jpg",
            artist: "The Chainsmokers",
            time: 193
          },
          state: {
            playing: true,
            shuffle: false,
            loop: false,
            time: 0
          }
        }
      }
    };
  }

  static get observers() {
    return ["_routePageChanged(routeData.page)"];
  }

  ready() {
    super.ready();
    vhCheck();
    addOfflineListener(offline => {
      this.set("offline", offline);
    });
    setInterval(() => {
      this._timer(this.player);
    }, 1000);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("change-page", e =>
      this._changePage(e.detail.path)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("change-page", e =>
      this._changePage(e.detail.path)
    );
  }

  _timer(player) {
    if (player.state.time < player.track.time) {
      this.set("player.state.time", player.state.time + 1);
    } else if (player.state.time === player.track.time) {
      this.set("player.state.playing", false);
    }
  }

  _routePageChanged(page) {
    switch (page) {
      case "":
        this._changePage(`/player`);
        break;
      case "player":
        import("./player-page.js");
        break;
      // case "edit":
      //   import("./edit-page.js");
      //   break;
      case "404":
        // import("./404-page.js");
        break;
      default:
        this._changePage(`/404`);
    }
  }

  _changePage(page) {
    window.history.pushState({}, "", page);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  _isActive(routePage, page) {
    return routePage === page;
  }
}

window.customElements.define("app-shell", AppShell);
