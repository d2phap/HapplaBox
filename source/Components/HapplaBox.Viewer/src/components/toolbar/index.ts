
import { compileTemplate } from '@/utils';
import { HbToolbarOptions, HbToolbarItem } from './types';

import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import buttonTemplate from './button.html';
import dividerTemplate from './divider.html';

const BTN_SHOW_MORE = 'btnShowMore';
const BTN_MENU = 'btnMenu';

const styleEl = document.createElement('style');
styleEl.textContent = styles;


export class HbToolbar extends BaseElement {
  #containerEl: HTMLDivElement;
  #groupListEl: HTMLDivElement;
  #groupBottomEl: HTMLDivElement;
  #overflowDropdownEl: HTMLDivElement;

  #resizeObserver: ResizeObserver;
  #isOverflow = false;
  #isOverflowOpen = false;
  #allItems: HbToolbarItem[] = [];

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

  private get builtInItems(): HbToolbarItem[] {
    return [
      { type: 'space', group: 'bottom' },
      {
        type: 'button',
        name: BTN_SHOW_MORE,
        group: 'bottom',
        cssClass: 'hide',
        imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/gotoimage.svg',
        label: 'Show more items',
        tooltip: 'Show more items',
        checkable: true,
        clickFn: () => this.toggleOverflowDropdown(),
      },
      {
        type: 'button',
        name: BTN_MENU,
        group: 'bottom',
        imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/menu.svg',
        label: 'Menu',
        tooltip: 'Menu... (`)',
        clickFn: console.log,
      },
    ];
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
    this.#overflowDropdownEl = overflowEl;

    this.shadowRoot.appendChild(this.#containerEl);
    this.shadowRoot.appendChild(this.#overflowDropdownEl);
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
    this.#overflowDropdownEl.innerHTML = '';

    Array.from(this.#groupListEl.children).forEach(el => {
      const itemEl = el as HTMLElement;
      const itemName = itemEl.getAttribute('name');
      const isItemOverflow = itemEl.offsetLeft >= offsetLeft - itemEl.clientWidth;

      if (isItemOverflow) {
        const clonedItem = itemEl.cloneNode(true);
        itemEl.classList.add('is--overflow');

        this.#overflowDropdownEl.appendChild(clonedItem);
      }
      else {
        itemEl.classList.remove('is--overflow');
      }

      const item = this.#options.items.find(i => i.name === itemName);
      if (item) {
        item.overflow = isItemOverflow;
      }
    });

    // add event for overflow items
    this.addItemEvents(true);

    this.#isOverflow = this.#overflowDropdownEl.children.length > 0;
    const btnEl = this.#groupBottomEl.querySelector(`[name="${BTN_SHOW_MORE}"]`);

    // show BTN_SHOW_MORE button if it's overflow
    if (btnEl && this.#isOverflow) {
      btnEl.classList.remove('hide');
    }
    else {
      btnEl.classList.add('hide');
    }
  }

  private onItemClicked(e: PointerEvent, itemName: string) {
    const el = e.currentTarget as HTMLElement;
    const item = this.#allItems.find(i => i.name === itemName);

    if (!item) return;

    if (item.checkable) {
      item.isChecked = !item.isChecked;

      if (item.isChecked) {
        el.classList.add('is--selected');
      }
      else {
        el.classList.remove('is--selected');
      }
    }

    item.clickFn(e, itemName);
  }

  private addItemEvents(overflowItemsOnly = false) {
    let list: NodeListOf<Element>;

    if (overflowItemsOnly) {
      list = this.#overflowDropdownEl.querySelectorAll('.toolbar-item');
    }
    else {
      list = this.#containerEl.querySelectorAll('.toolbar-item');
    }

    list.forEach(n => {
      const el = n as HTMLElement;
      const itemName = el.getAttribute('name');
      const toolbarItem = this.#allItems.find(i => i.name === itemName);

      if (toolbarItem) {
        const clickEvent = (e: PointerEvent) => this.onItemClicked(e, itemName);

        if (toolbarItem.type === 'button') {
          n.removeEventListener('click', clickEvent, true);
          n.addEventListener('click', clickEvent, true);
        }
      }
    });
  }

  private renderItems() {
    const groupListFragment = document.createDocumentFragment();
    const groupBottomFragment = document.createDocumentFragment();

    for (let i = 0; i < this.#allItems.length; i++) {
      const item = this.#allItems[i];
      const itemEl = document.createElement('template');
      let template = '';

      if (item.type === 'button') {
        template = buttonTemplate;
      }
      else if (item.type === 'divider' || item.type === 'space') {
        template = dividerTemplate;
      }

      itemEl.innerHTML = compileTemplate(template, item);

      if (item.group === 'bottom') {
        groupBottomFragment.appendChild(itemEl.content.cloneNode(true));
      }
      else {
        groupListFragment.appendChild(itemEl.content.cloneNode(true));
      }
    }

    this.#groupListEl.innerHTML = '';
    this.#groupListEl.appendChild(groupListFragment);

    this.#groupBottomEl.innerHTML = '';
    this.#groupBottomEl.appendChild(groupBottomFragment);

    this.addItemEvents();
  }

  public load(options: HbToolbarOptions) {
    this.#options = {
      ...this.#options,
      ...options,
    };

    this.#allItems = [
      ...this.#options.items,
      ...this.builtInItems,
    ];

    this.renderItems();
  }

  public toggleOverflowDropdown() {
    this.#isOverflowOpen = !this.#isOverflowOpen;

    if (this.#isOverflowOpen) {
      this.#overflowDropdownEl.classList.add('show');
    }
    else {
      this.#overflowDropdownEl.classList.remove('show');
    }
  }
}

export const init = () => window.customElements.define('hb-toolbar', HbToolbar);
