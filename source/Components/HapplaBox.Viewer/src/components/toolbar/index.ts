
import { compileTemplate } from '@/utils';
import { HbToolbarOptions } from './types';

import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import buttonTemplate from './button.html';
import dividerTemplate from './divider.html';


const styleEl = document.createElement('style');
styleEl.textContent = styles;


export class HbToolbar extends BaseElement {
  #containerEl: HTMLDivElement;
  #resizeObserver: ResizeObserver;

  #options: HbToolbarOptions = {
    items: [],
    position: 'top',
    rightClickFn: () => undefined,
  };

  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // private methods
    this.createContainer = this.createContainer.bind(this);
    this.renderItems = this.renderItems.bind(this);

    // private events
    this.onAuxClicked = this.onAuxClicked.bind(this);
    this.onResize = this.onResize.bind(this);

    // public methods
    this.load = this.load.bind(this);

    this.#containerEl = this.createContainer();
    this.shadowRoot.appendChild(this.#containerEl);

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private createContainer() {
    const el = document.createElement('div');
    el.classList.add('toolbar-container');

    // disable browser default context menu
    el.addEventListener('contextmenu', e => e.preventDefault(), true);
    el.addEventListener('auxclick', this.onAuxClicked, true);

    return el;
  }

  private onAuxClicked(e: PointerEvent) {
    e.stopPropagation();

    // right click
    if (e.button === 2) {
      this.#options.rightClickFn(e);
    }
  }

  private onResize() {
    // todo
  }

  private renderItems() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.#options.items.length; i++) {
      const item = this.#options.items[i];
      const itemEl = document.createElement('template');
      let template = '';

      if (item.type === 'button') {
        template = buttonTemplate;
      }
      else if (item.type === 'divider' || item.type === 'space') {
        template = dividerTemplate;
      }

      itemEl.innerHTML = compileTemplate(template, item);

      fragment.appendChild(itemEl.content.cloneNode(true));
    }

    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);
  }


  public load(options: HbToolbarOptions) {
    this.#options = {
      ...this.#options,
      ...options,
    };

    this.renderItems();
  }
}

export const init = () => window.customElements.define('hb-toolbar', HbToolbar);
