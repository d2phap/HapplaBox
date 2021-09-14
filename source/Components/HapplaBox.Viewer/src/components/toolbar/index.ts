
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
  #groupTopEl: HTMLDivElement;
  #groupCenterEl: HTMLDivElement;
  #groupBottomEl: HTMLDivElement;

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
    this.createTemplate = this.createTemplate.bind(this);
    this.renderItems = this.renderItems.bind(this);

    // private events
    this.onAuxClicked = this.onAuxClicked.bind(this);
    this.onResize = this.onResize.bind(this);

    // public methods
    this.load = this.load.bind(this);

    this.createTemplate();
    this.shadowRoot.appendChild(this.#containerEl);

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private createTemplate() {
    // top group
    const groupTopEl = document.createElement('div');
    groupTopEl.classList.add('group', 'group-top');

    // center group
    const groupCenterEl = document.createElement('div');
    groupCenterEl.classList.add('group', 'group-center');

    // bottom group
    const groupBottomEl = document.createElement('div');
    groupBottomEl.classList.add('group', 'group-bottom');

    // toolbar container
    const containerEl = document.createElement('div');
    containerEl.classList.add('toolbar-container');
    containerEl.appendChild(groupTopEl);
    containerEl.appendChild(groupCenterEl);
    containerEl.appendChild(groupBottomEl);

    // disable browser default context menu
    containerEl.addEventListener('contextmenu', e => e.preventDefault(), true);
    containerEl.addEventListener('auxclick', this.onAuxClicked, true);

    this.#containerEl = containerEl;
    this.#groupTopEl = groupTopEl;
    this.#groupCenterEl = groupCenterEl;
    this.#groupBottomEl = groupBottomEl;
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
    const topFragment = document.createDocumentFragment();
    const centerFragment = document.createDocumentFragment();
    const bottomFragment = document.createDocumentFragment();

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

      if (item.group === 'top') {
        topFragment.appendChild(itemEl.content.cloneNode(true));
      }
      else if (item.group === 'bottom') {
        bottomFragment.appendChild(itemEl.content.cloneNode(true));
      }
      else {
        centerFragment.appendChild(itemEl.content.cloneNode(true));
      }
    }

    this.#groupTopEl.innerHTML = '';
    this.#groupTopEl.appendChild(topFragment);

    this.#groupCenterEl.innerHTML = '';
    this.#groupCenterEl.appendChild(centerFragment);

    this.#groupBottomEl.innerHTML = '';
    this.#groupBottomEl.appendChild(bottomFragment);
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
