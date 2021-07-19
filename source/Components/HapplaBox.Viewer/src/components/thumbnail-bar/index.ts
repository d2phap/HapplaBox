
import BaseElement from '@/components/BaseElement';
import styles from '@/components/thumbnail-bar/styles.inline.scss';
import template from '@/components/thumbnail-bar/template.html';

const rootEl = document.createElement('template');
rootEl.innerHTML = template;

const styleEl = document.createElement('style');
styleEl.textContent = styles;

class ThumbnailBar extends BaseElement {
  private multiselect = false;

  constructor() {
    super();

    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMultiselectChanged = this.onMultiselectChanged.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);


    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(rootEl.content.cloneNode(true));

    const listEl = this.shadowRoot.querySelector('.thumbnail-list');
    listEl.addEventListener('wheel', this.onMouseWheel, false);
    listEl.addEventListener('keydown', this.onKeyDown, false);
  }

  static get observedAttributes() {
    return ['multiselect'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'multiselect') {
      this.onMultiselectChanged(oldValue, newValue);
    }
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

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (!this.multiselect) {
        const allSelections = this.shadowRoot.querySelectorAll('.active');
        allSelections.forEach(el => el.classList.remove('active'));
      }

      this.shadowRoot.activeElement.classList.add('active');
      this.scrollToItem(this.shadowRoot.activeElement);
    }
  }

  onMultiselectChanged(oldValue: string, newValue: string) {
    this.multiselect = newValue.toLowerCase() === 'true';

    if (!this.multiselect) {
      const allSelections = Array.from(this.shadowRoot.querySelectorAll('.active'));
      const lastItem = allSelections.pop();

      allSelections.forEach(el => el.classList.remove('active'));

      this.scrollToItem(lastItem);
    }
  }

  public scrollToItem(el: Element) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

window.customElements.define('thumbnail-bar', ThumbnailBar);
