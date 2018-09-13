import {LitElement, html} from '@polymer/lit-element';
import {repeat} from 'lit-html/lib/repeat';
import {lensPath} from 'ramda';

// File (standard file object) 
//   name
//   size
//   type
// +
//   uploadId
//   parts [Part...]
//   status - uploading, complete, failed
//   error - message
// 
// Part
//   url - signed url for upload
//   status - uploading, complete, aborted, failed
//   error - message
// 
// TODO
//   `elapsed`: Elapsed time since the upload started.  * - `elapsedStr`
//   `remaining`: Number of seconds remaining for the upload to finish.  * - `remainingStr`
//   `progress`: Percentage of the file already uploaded.
//   `speed`: Upload speed in kB/s.
//   `size`: File size in bytes.  `totalStr`: Human-readable total size of the file.
//   `loaded`: Bytes transferred so far.  `loadedStr`: Human-readable uploaded size at the moment.


const data = {
  id: "123",
  parts: [
    {url: "http://test1", size: 123, uploaded: false},
    {url: "http://test2", size: 123, uploaded: false},
    {url: "http://test3", size: 12, uploaded: false},
  ]
};


class SFUpload extends LitElement {

  constructor() {
    super();
    this.files=[];
    this.uploadPart = this.uploadPart.bind(this);
    this.getParts = this.getParts.bind(this);
  }

  static get properties() { 
    return { files: Array }
  }

  uploadPart(part) {
    setTimeout(() => {
      var newFiles = [
         ...this.files
      ]
      newFiles[0].upload.parts[0].uploaded = true;
      this.files = newFiles;
    }, Math.random()*1000);
  }

  getParts(file) {
    console.log(file);
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
    }, Math.random()*1000);
  }

  _fileChange(files) {
    for (var i = 0; i < files.length; i++) {
      this.getParts(files[i]);
    }
  }

  renderParts(upload) {
    if (upload) {
      return html`
        ${repeat(upload.parts, (part) =>
          html`<div>Part: ${part.url} ${part.uploaded}</div>`)}
      `;
    }
  }

  renderFile(file) {
    if (file) {
      return html`
      <style>
        div.file {
          border: 1px solid #ddd;
        }
      </style>
      <div class="file">
        <strong>${file.name}</strong> Upload ID: ${file.upload.id}
        ${this.renderParts(file.upload)}
      </div>`
    }
  }

  renderFiles(files) {
    if (files) {
      return html`${repeat(files, (file) => this.renderFile(file))}`
    }
  }

  _render({files}) {
    return html`
      <style>
        input.upload {
          margin-bottom: 5px;
        }
      </style>
      <input type="file" id="file" class="upload" multiple
         onchange="${(e) => this._fileChange(e.target.files)}">
      ${this.renderFiles(files)}
    `
  }
  
}

customElements.define('sf-upload', SFUpload);
