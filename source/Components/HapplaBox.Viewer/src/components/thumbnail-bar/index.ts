
import styles from '@/components/thumbnail-bar/styles.inline.scss';
import template from '@/components/thumbnail-bar/template.html';

const rootEl = document.createElement('template');
rootEl.innerHTML = template;

const styleEl = document.createElement('style');
styleEl.textContent = styles;

class ThumbnailBar extends HTMLElement {
  constructor() {
    super();

    this.onMouseWheel = this.onMouseWheel.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(rootEl.content.cloneNode(true));

    const listEl = this.shadowRoot.querySelector('.thumbnail-list');
    listEl.addEventListener('wheel', this.onMouseWheel, false);
  }

  static get observedAttributes() {
    return ['name-attribute'];
  }

  onMouseWheel(e: WheelEvent) {
    // direction is vertical (mouse wheel)
    if (e.deltaX === 0) {
      e.preventDefault();

      // enable horizontal scrolling on mouse wheel
      // @ts-ignore
      e.currentTarget.scrollLeft += e.deltaY;
    }
  }

  // attributeChangedCallback(name: string, oldValue: string, newValue: string) {
  //   if (name === 'name-attribute') {
  //     this.shadowRoot.querySelector('a')
  //       .href = `https://www.google.com/search?q=${newValue}`;
  //   }
  // }
}

window.customElements.define('thumbnail-bar', ThumbnailBar);
