import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

const data = {
  id: "123",
  parts: [
    {url: "http://test1", size: 123, uploaded: false},
  ]
};

export class UploadFile extends PolymerElement {
  static get properties() {
    return {
      file: Object,
    }
  }

  static get template() {
    console.log('upload file get template');
    return html`
      <div>Filename: [[file.name]] Uploaded: [[file.uploaded]]</div>
    `;
  }
}

customElements.define('sf-upload-file', UploadFile);

export class Upload extends PolymerElement {
  static get properties() {
    return {
      files: {
        type: Array,
        // notify: true,
      }
    }
  }

  static get template() {
    console.log('upload get template');
    return html`
      <input type="file" id="file" multiple on-change="handleChange">
      <template is="dom-repeat" items="{{files}}" as="file">
        <sf-upload-file file="[[file]]"></sf-upload-file>
      </template>
    `;
  }

  handleChange(e) {
    var files = e.target.files;
    this.files = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      file.uploaded = false;
      this.files.push(file);
    }
  }
}

customElements.define('sf-upload', Upload);
