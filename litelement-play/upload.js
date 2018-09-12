import {LitElement, html} from '@polymer/lit-element';
import './uploadFile.js';

const data = {
  id: "123",
  parts: [
    {url: "http://test1", size: 123, uploaded: false},
  ]
};


class SFUpload extends LitElement {

  constructor() {
    super();
    this.uploadPart = this.uploadPart.bind(this);
  }

  static get properties() { 
    return { files: Object }
  }

  uploadPart(part) {
    console.log('uploadPart start', part);
    setTimeout(() => {
      console.log('uploadPart returned', this);
      var newFiles = [
         ...this.files
      ]
      newFiles[0].upload.parts[0].uploaded = true;
      this.files = newFiles;
    }, 3000);
  }

  getParts(file) {
    setTimeout(() => {
      file.upload = data;
      var newFiles = [
        ...this.files
      ];
      newFiles.push(file);
      this.files = newFiles;

      file.upload.parts.forEach(part => {
        this.uploadPart(part);
      });

    }, 1000);
  }

  _fileChange(files) {
    this.files = [];
    for (var i = 0; i < files.length; i++) {
      this.getParts(files[i]);
    }
  }

  renderFiles(files) {
    if (files) {
      const filesTemplate = [];
      for (var i = 0; i < files.length; i++) {
        filesTemplate.push(html`<sf-upload-file file="${files[i]}"></sf-upload-file>`);
      }
      return filesTemplate;
    }
  }

  _render({files}) {
    console.log('render upload', this);
    return html`
        <input type="file" id="file" multiple
           onchange="${(e) => this._fileChange(e.target.files)}">
        ${this.renderFiles(files)}`
  }
  
}

customElements.define('sf-upload', SFUpload);
