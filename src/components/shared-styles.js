import "@polymer/polymer/polymer-element.js";

const $_documentContainer = document.createElement("template");
// TODO: remove html
// $_documentContainer.innerHTML = `
$_documentContainer.innerHTML = `
  <dom-module id="shared-styles">
    <template>
      <style>
        :root {
          --box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.1);
          --box-shadow-active: 0px 12px 16px -2px rgba(0, 0, 0, 0.1);
        }
        .fab {
          position: relative;
          padding: 8px;
          width: 24px;
          height: 24px;
          color: #757575;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: var(--box-shadow);
          transition: box-shadow 0.2s;
        }

        .fab:active {
          box-shadow: var(--box-shadow-active);
        }

        .icon-button {
            position: relative;
            padding: 8px;
            width: 24px;
            height: 24px;
            color: #757575;
            border-radius: 50%;
        }
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer.content);
