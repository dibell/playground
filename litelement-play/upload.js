import {LitElement, html} from '@polymer/lit-element';
import {repeat} from 'lit-html/lib/repeat';
// have to do this as babel-plugin-ramda is not currently available in polymer serve/build
import append from 'ramda/es/append';
import assoc from 'ramda/es/assoc';
import assocPath from 'ramda/es/assocPath';
import update from 'ramda/es/update';
import lensPath from 'ramda/es/lensPath';
import view from 'ramda/es/view';
import set from 'ramda/es/set';
import all from 'ramda/es/all';
import propEq from 'ramda/es/propEq';
import pathOr from 'ramda/es/pathOr';

// File (like the standard file object) 
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


// just for dev
const getRandomUUID = () => {
  const rs = (len) => {
    var arr = new Uint8Array(len/2);
    window.crypto.getRandomValues(arr);
    return  Array.from(arr, (dec) => dec.toString(16)).join('');
  }
  return `${rs(8)}-${rs(4)}-${rs(4)}-${rs(4)}-${rs(12)}`
}

const getDummyData = (filename) => {
  const data = {
    id: getRandomUUID(),
    parts: [
      {url: `http://${filename}/part1`, size: 123},
      {url: `http://${filename}/part2`, size: 123},
      {url: `http://${filename}/part3`, size: 12},
    ]
  };
  return data;
}

const getFile = (name, files) => {
  const index = files.findIndex(v => v.name === name);
  return {file: files[index], index}
}

const setFileStatus = (status, file) => 
  assoc('status', status, file);

const updateFiles = (file, index, files) =>
  update(index, file)(files);


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

  uploadPart(file, part) {
    setTimeout(() => {
      console.log('uploadPart done', file.name, part);
      const fileIndex = this.files.findIndex(v => v.name === file.name);
      const partIndex = this.files[fileIndex].upload.parts.findIndex(v => v.url === part.url);

      const newPart = assoc('status', 'done')(this.files[fileIndex].upload.parts[partIndex])
      const newParts = update(partIndex, newPart)(this.files[fileIndex].upload.parts);
      const newFile = assocPath(['upload', 'parts'], newParts)(this.files[fileIndex]);
      this.files = update(fileIndex, newFile)(this.files);

      // console.log(JSON.stringify(this.files, null, 2));
      // check if all are done
      const parts = pathOr([], ['upload', 'parts'], this.files[fileIndex]);
      if (all(propEq('status', 'done'), parts)) {
        console.log('all done');
      } else {
        console.log('still waiting');
      }

    }, Math.random()*1000);
  }

  getParts(file) {
    setTimeout(() => {
      file.upload = getDummyData(file.name);
      this.files = append(file)(this.files);

      file.upload.parts.forEach(part => {
        this.uploadPart(file, part);
      });
    }, Math.random()*1000);
  }

  _fileChange(files) {
    this.files = [];
    for (var i = 0; i < files.length; i++) {
      this.getParts(files[i]);
    }
  }

  renderParts(upload) {
    if (upload) {
      return html`
        ${repeat(upload.parts, (part) =>
          html`<div>Part: ${part.url} ${part.status}</div>`)}
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
