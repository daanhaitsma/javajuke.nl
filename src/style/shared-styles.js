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
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer.content);
