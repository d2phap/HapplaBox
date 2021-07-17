
import styles from '@/components/thumbnail-bar/styles.inline.scss';
import template from '@/components/thumbnail-bar/template.html';


class ThumbnailBar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const el = document.createElement('template');
    el.innerHTML = template;

    const style = document.createElement('style');
    style.textContent = styles;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(el.content.cloneNode(true));
    this.shadowRoot.querySelector('a').href = '';
  }

  static get observedAttributes() {
    return ['name-attribute'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'name-attribute') {
      this.shadowRoot.querySelector('a')
        .href = `https://www.google.com/search?q=${newValue}`;
    }
  }
}

window.customElements.define('thumbnail-bar', ThumbnailBar);
