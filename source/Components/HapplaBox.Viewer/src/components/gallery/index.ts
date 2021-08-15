
import { compileTemplate, pause } from '@/utils';
import BaseElement from '@/components/BaseElement';

import { HbGalleryOptions } from './types';
import styles from './styles.inline.scss';
import itemTemplate from './item.html';


const CLASS_SELECTED = 'is--selected';

const styleEl = document.createElement('style');
styleEl.textContent = styles;

export class HbGallery extends BaseElement {
  #lastRepaintPos: number = undefined;
  #maxBuffer = 0;

  #cachedItemsLength = 0;
  #containerEl: HTMLElement;
  #scrollerEl: HTMLElement;
  #resizeObserver: ResizeObserver;

  #selectedItems: number[] = [];

  #options: HbGalleryOptions = {
    isHorizontal: true,
    items: [],
    isSelectOnClicked: true,
    clickItemFn: () => undefined,
    rightClickItemFn: () => undefined,
    middleClickItemFn: () => undefined,
    doubleClickItemFn: () => undefined,
  };


  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // bind events
    this.onScroll = this.onScroll.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onAttrHideLabelChanged = this.onAttrHideLabelChanged.bind(this);
    this.onItemClicked = this.onItemClicked.bind(this);
    this.onItemAuxClicked = this.onItemAuxClicked.bind(this);
    this.onItemDoulbeClicked = this.onItemDoulbeClicked.bind(this);

    // bind methods
    this.renderItems = this.renderItems.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.createScroller = this.createScroller.bind(this);
    this.setScrollerSize = this.setScrollerSize.bind(this);
    this.redrawItems = this.redrawItems.bind(this);

    this.load = this.load.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.selectItems = this.selectItems.bind(this);

    this.#scrollerEl = this.createScroller();
    this.#containerEl = this.createContainer();
    this.shadowRoot.appendChild(this.#containerEl);

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  get itemSize() {
    const rootStyle = getComputedStyle(document.body);

    return parseInt(rootStyle.getPropertyValue('--thumbnailSize').trim(), 10);
  }

  get itemRenderedSize() {
    return this.itemSize + 11;
  }

  get container() {
    return this.#containerEl;
  }

  get containerSize() {
    if (this.#options.isHorizontal) {
      return this.#containerEl.clientWidth;
    }

    return this.#containerEl.clientHeight;
  }

  get scrollingSize() {
    return this.itemRenderedSize * this.#options.items.length;
  }

  get maxItemsOnScreen() {
    return Math.ceil(this.containerSize / this.itemRenderedSize);
  }

  static get observedAttributes() {
    return ['hide-label'];
  }

  private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) {
      return;
    }

    if (name === 'hide-label') {
      this.onAttrHideLabelChanged(newVal);
    }
  }

  private connectedCallback() {
    //
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private async onScroll(e: Event) {
    e.preventDefault();

    this.addRenderRequest();
    // this.redrawItems();
  }

  #renderRequest = 0;
  private async addRenderRequest(force: boolean = false) {
    this.#renderRequest += 1;

    // console.log(this.#renderRequest);

    while(this.#renderRequest > 0) {
      await pause(150);
      this.#renderRequest -= 1;
    }

    if (this.#renderRequest <= 0) {
      // console.log('*** ', this.#renderRequest);

      this.redrawItems(force);
      this.#renderRequest = 0;
    }
  }

  private onMouseWheel(e: WheelEvent) {
    // direction is vertical (mouse wheel)
    if (e.deltaX === 0) {
      e.preventDefault();

      // enable horizontal scrolling on mouse wheel
      // @ts-ignore
      e.currentTarget.scrollLeft += e.deltaY;
    }
  }

  private onItemClicked(e: PointerEvent) {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    const index = parseInt(el.getAttribute('data-index'), 10);

    if (this.#options.isSelectOnClicked) {
      this.selectItems([index]);
    }

    console.log('clicked');

    this.#options.clickItemFn(e, { index, el });
  }

  private onItemAuxClicked(e: PointerEvent) {
    e.stopPropagation();

    const el = e.currentTarget as HTMLElement;
    const index = parseInt(el.getAttribute('data-index'), 10);

    // middle click
    if (e.button === 1) {
      this.#options.middleClickItemFn(e, { index, el });
    }
    // right click
    else if (e.button === 2) {
      this.#options.rightClickItemFn(e, { index, el });
    }
  }

  private onItemDoulbeClicked(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const index = parseInt(el.getAttribute('data-index'), 10);

    this.#options.doubleClickItemFn(e, { index, el });
  }

  private onResize() {
    this.#cachedItemsLength = this.maxItemsOnScreen * 3;
    this.#maxBuffer = this.maxItemsOnScreen * this.itemRenderedSize;

    this.redrawItems(true);
  }

  private onAttrHideLabelChanged(val: string) {
    if (val === 'false') {
      this.#containerEl.style.setProperty('--infoDisplay', 'block');
    }
    else {
      this.#containerEl.style.setProperty('--infoDisplay', 'none');
    }
  }


  private createContainer() {
    const el = document.createElement('div');
    el.classList.add('gallery-container');
    el.tabIndex = 0;

    // disable scrolling on middle click
    el.addEventListener('mousedown', e => e.preventDefault());
    el.addEventListener('scroll', this.onScroll);
    el.addEventListener('wheel', this.onMouseWheel);

    return el;
  }

  private createScroller() {
    const el = document.createElement('div');
    el.classList.add('gallery-scroller');

    el.style.top = '0';
    el.style.left = '0';

    return el;
  }

  private setScrollerSize(size: number) {
    if (!this.#scrollerEl) {
      return;
    }

    if (this.#options.isHorizontal) {
      this.#scrollerEl.style.width = `${size}px`;
      this.#scrollerEl.style.height = '1px';
    }
    else {
      this.#scrollerEl.style.width = '1px';
      this.#scrollerEl.style.height = `${size}px`;
    }
  }

  private async redrawItems(forced: boolean = false) {
    await pause(100);
    if (this.#renderRequest) {
      //
    }


    const scrollPos = this.#options.isHorizontal
      ? this.#containerEl.scrollLeft
      : this.#containerEl.scrollTop;

    let first = Math.trunc(scrollPos / this.itemRenderedSize - this.maxItemsOnScreen);
    first = first < 0 ? 0 : first;

    const isScrollChanged = Math.abs(scrollPos - this.#lastRepaintPos) > this.#maxBuffer;

    if (forced || !this.#lastRepaintPos || isScrollChanged) {
      this.#lastRepaintPos = scrollPos;
      this.renderItems(first, this.#cachedItemsLength);
    }
  }

  private renderItems(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();

    let finalItem = fromPos + howMany;
    if (finalItem > this.#options.items.length) {
      finalItem = this.#options.items.length;
    }

    // for center alignment
    let firstPadding = 0;
    if (this.#options.items.length < this.maxItemsOnScreen) {
      firstPadding += this.containerSize / 2 - this.scrollingSize / 2;
    }

    for (let i = fromPos; i < finalItem; i++) {
      let style = '';
      let cssClass = '';
      const itemPos = firstPadding + (i * this.itemRenderedSize);

      // set item position
      if (this.#options.isHorizontal) {
        style = `left: ${itemPos}px`;
      }
      else {
        style = `top: ${itemPos}px`;
      }

      // set selected item
      if (this.#selectedItems.includes(i)) {
        cssClass = CLASS_SELECTED;
      }

      const itemEl = document.createElement('template');
      itemEl.innerHTML = compileTemplate(itemTemplate, {
        ...this.#options.items[i],
        style,
        class: cssClass,
        index: i,
      });

      Array.from(fragment.children).forEach(n => {
        n.addEventListener('click', this.onItemClicked, true);
        n.addEventListener('auxclick', this.onItemAuxClicked, true);
        n.addEventListener('dblclick', this.onItemDoulbeClicked, true);

        // disable browser default context menu
        n.addEventListener('contextmenu', e => e.preventDefault(), true);
      });

      fragment.appendChild(itemEl.content.cloneNode(true));
    }

    fragment.appendChild(this.#scrollerEl);

    // eslint-disable-next-line no-param-reassign
    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);
  }


  /**
   * Loads items
   */
  public load(config: HbGalleryOptions) {
    this.#options = {
      ...this.#options,
      ...config,
    };

    this.#cachedItemsLength = this.maxItemsOnScreen * 3;
    this.#maxBuffer = this.maxItemsOnScreen * this.itemRenderedSize;

    this.setScrollerSize(this.scrollingSize);
    this.renderItems(0, this.#cachedItemsLength / 2);
  }

  /**
   * Scrolls to item by the given index
   */
  public scrollToIndex(index: number) {
    // get center item position
    const itemPos = (index * this.itemRenderedSize)
      - (this.containerSize / 2)
      - this.itemRenderedSize;

    this.#containerEl.scrollTo({
      left: this.#options.isHorizontal ? itemPos : undefined,
      top: this.#options.isHorizontal ? undefined : itemPos,
      behavior: 'smooth',
    });
  }

  /**
   * Selects items by the given index array
   * @param indexArr Array of indexes
   * @param appendSelection
   * -
   * - `true` to insert `indexArr` into the current selection list;
   * - `false` to replace the current selection list by `indexArr`.
   */
  public selectItems(indexArr: number[], appendSelection: boolean = false) {
    // deselect the old items
    if (this.#selectedItems.length > 0) {
      const oldSelectionQuery = this.#selectedItems
        .map(i => `[data-index="${i}"]`)
        .join(',');

      const els = this.#containerEl.querySelectorAll(oldSelectionQuery);
      els.forEach(el => el.classList.remove(CLASS_SELECTED));
    }

    // select the new items
    if (indexArr.length > 0) {
      const newSelectionQuery = indexArr
        .map(i => `[data-index="${i}"]`)
        .join(',');

      const els = this.#containerEl.querySelectorAll(newSelectionQuery);
      els.forEach(el => el.classList.add(CLASS_SELECTED));
    }

    // update selection list
    if (appendSelection) {
      this.#selectedItems.push(...indexArr);
    }
    else {
      this.#selectedItems = indexArr;
    }

    // sort index asc
    this.#selectedItems.sort((a, b) => a - b);
  }
}


export const init = () => window.customElements.define('hb-gallery', HbGallery);
