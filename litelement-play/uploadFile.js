import {LitElement, html} from '@polymer/lit-element';

class SFUploadFile extends LitElement {
  constructor() {
    super();
    this.renderPart = this.renderPart.bind(this);
    this.addEventListener('part-done', this.partDone.bind(this));
  }

  static get properties() { 
    return { 
      file: Object,
    }
  }

  ready() {
    super.ready();
  }

  partDone(e) {
    console.log('partDone', e.detail);
  }

  renderPart(part) {
    return html`<div>${part.url} - ${part.uploaded}</div>`;
  }

  _render({file}) {
    console.log('render file', file);
    if (file) {
      return html`<div>
        <h2>${file.name} (${file.size}) - ${file.type}</h2>
        Upload ID: ${file.upload.id}
        <div>${file.upload.parts.map(this.renderPart)}</div>
      </div>`;
    } else {
      return html`No file!!`;
    }
  }
}

customElements.define('sf-upload-file', SFUploadFile);
