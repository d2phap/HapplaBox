
import { compileTemplate } from '@/utils';
import { HbToolbarOptions, HbToolbarButton } from './types';

import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import buttonTemplate from './button.html';
import dividerTemplate from './divider.html';


const styleEl = document.createElement('style');
styleEl.textContent = styles;


export class HbToolbar extends BaseElement {
  #containerEl: HTMLDivElement;
  #groupListEl: HTMLDivElement;
  #groupBottomEl: HTMLDivElement;
  #overflowEl: HTMLDivElement;
  #resizeObserver: ResizeObserver;
  #isOverflowOpen = false;

  #options: HbToolbarOptions = {
    items: [],
    position: 'top',
    rightClickFn: () => undefined,
  };

  constructor() {
    super();

    // private methods
    this.createTemplate = this.createTemplate.bind(this);
    this.renderItems = this.renderItems.bind(this);

    // private events
    this.onAuxClicked = this.onAuxClicked.bind(this);
    this.onResize = this.onResize.bind(this);
    this.addItemEvents = this.addItemEvents.bind(this);
    this.onItemClicked = this.onItemClicked.bind(this);

    // public methods
    this.load = this.load.bind(this);

    // initialize template
    this.createTemplate();

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private createTemplate() {
    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // items list
    const groupListEl = document.createElement('div');
    groupListEl.classList.add('group', 'group-list');

    // bottom group
    const groupBottomEl = document.createElement('div');
    groupBottomEl.classList.add('group', 'group-bottom');

    // overflow dropdown
    const overflowEl = document.createElement('div');
    overflowEl.classList.add('menu', 'menu-overflow');

    // disable browser default context menu
    overflowEl.addEventListener('contextmenu', e => e.preventDefault(), true);
    overflowEl.addEventListener('auxclick', this.onAuxClicked, true);

    // toolbar container
    const containerEl = document.createElement('div');
    containerEl.classList.add('toolbar-container');
    containerEl.appendChild(groupListEl);
    containerEl.appendChild(groupBottomEl);

    // disable browser default context menu
    containerEl.addEventListener('contextmenu', e => e.preventDefault(), true);
    containerEl.addEventListener('auxclick', this.onAuxClicked, true);

    this.#groupListEl = groupListEl;
    this.#groupBottomEl = groupBottomEl;
    this.#containerEl = containerEl;
    this.#overflowEl = overflowEl;

    this.shadowRoot.appendChild(this.#containerEl);
    this.shadowRoot.appendChild(this.#overflowEl);
  }

  private onAuxClicked(e: PointerEvent) {
    e.stopPropagation();

    // right click
    if (e.button === 2) {
      this.#options.rightClickFn(e);
    }
  }

  private onResize() {
    const { offsetLeft } = this.#groupBottomEl;
    this.#overflowEl.innerHTML = '';

    Array.from(this.#groupListEl.children).forEach(item => {
      const el = item as HTMLElement;
      const itemIndex = parseInt(el.getAttribute('data-index'), 10);

      if (el.offsetLeft + el.clientWidth >= offsetLeft) {
        const clonedItem = el.cloneNode(true);
        el.classList.add('is--overflow');

        this.#options.items[itemIndex].overflow = true;
        this.#overflowEl.appendChild(clonedItem);
      }
      else {
        el.classList.remove('is--overflow');
        this.#options.items[itemIndex].overflow = false;
      }
    });
  }

  private onItemClicked(e: PointerEvent, index: number) {
    const el = e.currentTarget as HTMLElement;
    const item = this.#options.items[index] as HbToolbarButton;

    if (item.checkable) {
      item.isChecked = !item.isChecked;

      if (item.isChecked) {
        el.classList.add('is--selected');
      }
      else {
        el.classList.remove('is--selected');
      }
    }

    item.clickFn(e, index);
  }

  private addItemEvents() {
    const list = this.#containerEl.querySelectorAll('.toolbar-item');

    list.forEach(n => {
      const el = n as HTMLElement;
      const itemIndex = parseInt(el.getAttribute('data-index'), 10);
      const toolbarItem = this.#options.items[itemIndex];

      if (toolbarItem.type === 'button') {
        n.addEventListener('click', (e: PointerEvent) => this.onItemClicked(e, itemIndex), true);
      }
    });
  }

  private renderItems() {
    const listFragment = document.createDocumentFragment();
    const overflowFragment = document.createDocumentFragment();

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

      itemEl.innerHTML = compileTemplate(template, {
        ...item,
        index: i,
      });

      if (item.group === 'bottom') {
        overflowFragment.appendChild(itemEl.content.cloneNode(true));
      }
      else {
        listFragment.appendChild(itemEl.content.cloneNode(true));
      }
    }

    this.#groupBottomEl.innerHTML = '';
    this.#groupBottomEl.appendChild(overflowFragment);

    this.#groupListEl.innerHTML = '';
    this.#groupListEl.appendChild(listFragment);

    this.addItemEvents();
  }


  public load(options: HbToolbarOptions) {
    this.#options = {
      ...this.#options,
      ...options,
    };

    this.renderItems();
  }

  public toggleOverflowDropdown() {
    this.#isOverflowOpen = !this.#isOverflowOpen;

    if (this.#isOverflowOpen) {
      this.#overflowEl.classList.add('show');
    }
    else {
      this.#overflowEl.classList.remove('show');
    }
  }
}

export const init = () => window.customElements.define('hb-toolbar', HbToolbar);
