import "@polymer/polymer/polymer-element.js";

const $_documentContainer = document.createElement("template");
$_documentContainer.innerHTML = `
  <dom-module id="shared-styles">
    <template>
      <style>
        :root {
          --box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.1);
          --box-shadow-active: 0px 12px 16px -2px rgba(0, 0, 0, 0.1);
          --active-color: #26A69A;
        }

        *:focus {
          outline: none;
        }

        p {
          margin: 0;
        }

        button{
          margin: 0;
          padding: 0;
          border: none;
          font: inherit;
          color: inherit;
          background: none;
        }

        paper-input {
          --paper-input-container-color: #757575;
          --paper-input-container-focus-color: var(--active-color);
          --paper-input-container-input-color: #757575;
        }

        p.title {
          font-size: 32px;
          font-weight: 600;
          text-align: center;
          color: #757575;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p.subtitle {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          color: #bdbdbd;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card {
          background-color: #fff;
          color: #757575;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
        }

        .fab {
          position: relative;
          padding: 8px;
          color: #757575;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s ease;
        }

        .fab:active {
          box-shadow: var(--box-shadow-active);
        }

        .icon-button {
          position: relative;
          padding: 8px;
          color: #757575;
          border-radius: 50%;
        }

        .progress-bar {
          width: 100%;
          height: 2px;
          background-color: #eee;
        }

        .progress {
          position: relative;
          max-width: 100%;
          height: 2px;
          background-color: #757575;
          transition: background-color 0.2s ease;
        }
        .progress.active {
          background-color: var(--active-color);
        }

        .overlay {
          position: fixed;
          z-index: 5;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
        }

        div.overlay > div.card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .card-modal {
          width: calc(100% - 64px);
          max-width: 328px;
          max-height: calc(100% - 64px);
          overflow-y: auto;
        }

        .modal-header {
          padding: 8px 16px;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          color: #757575;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-subtitle {
          font-size: 14px;
          text-align: center;
          color: #bdbdbd;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-content {
          display: grid;
          grid-template-columns: 100%;
          grid-auto-rows: 48px;
          align-items: center;
          justify-items: center;
        }

        .modal-input-content {
          padding: 8px 16px
        }

        .modal-option {
          position: relative;
          width: 100%;
          height: 100%;
          color: #757575;
          border-top: solid 1px #eee;
        }

        .add-new {
          position: relative;
          margin: 16px calc(50% - 64px) 0px calc(50% - 64px);
          width: 128px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-weight: 600;
          color: white;
          border-radius: 24px;
          background-color: var(--active-color);
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s ease;
        }
        
        .add-new:active {
          box-shadow: var(--box-shadow-active);
        }

        .empty-list-container {
          padding: 16px;
          width: 100%;
          box-sizing: border-box;
          color: #bdbdbd;
        }

        .empty-list-icon {
          margin: 0px calc(50% - 108px);
          width: 216px;
          height: 216px;
        }

        .empty-list-message {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin: 0;
        }
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer.content);
