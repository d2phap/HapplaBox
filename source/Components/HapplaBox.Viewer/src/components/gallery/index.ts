
import { compileTemplate, getCssVar, pause } from '@/utils';
import { HbGalleryOptions } from './types';

import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import itemTemplate from './item.html';


const CLASS_SELECTED = 'is--selected';

const styleEl = document.createElement('style');
styleEl.textContent = styles;

export class HbGallery extends BaseElement {
  #lastRepaintPos: number = undefined;
  #maxBuffer = 0;
  #isProgrammaticalylScroll = false;
  #renderTimer: NodeJS.Timeout = null;

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
    requestRenderItemsFn: () => undefined,
  };


  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // private events
    this.onContainerMouseDown = this.onContainerMouseDown.bind(this);
    this.onContainerMouseUp = this.onContainerMouseUp.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onAttrHideLabelChanged = this.onAttrHideLabelChanged.bind(this);
    this.onItemClicked = this.onItemClicked.bind(this);
    this.onItemAuxClicked = this.onItemAuxClicked.bind(this);
    this.onItemDoulbeClicked = this.onItemDoulbeClicked.bind(this);

    // private methods
    this.renderItemsTemplate = this.renderItemsTemplate.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.createScroller = this.createScroller.bind(this);
    this.setScrollerSize = this.setScrollerSize.bind(this);
    this.redrawItemsTemplate = this.redrawItemsTemplate.bind(this);

    // public methods
    this.load = this.load.bind(this);
    this.renderItem = this.renderItem.bind(this);
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
    return parseInt(getCssVar('--thumbnailSize'), 10);
  }

  get padding() {
    return this.itemSize / 10; // var(--padding)
  }

  get itemRenderedSize() {
    // [<padding>🖼️<padding>]<padding>[<padding>🖼️<padding>]...
    return this.itemSize + (this.padding * 3);
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

  private onScroll(e: Event) {
    e.preventDefault();

    if (this.#isProgrammaticalylScroll) {
      this.lazyRenderItems();
    }
    else {
      this.redrawItemsTemplate();
    }
  }

  private lazyRenderItems() {
    clearTimeout(this.#renderTimer);

    this.#renderTimer = setTimeout(async () => {
      this.redrawItemsTemplate();

      await pause(500);
      this.#isProgrammaticalylScroll = false;
    }, 50);
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

    this.redrawItemsTemplate(true);
  }

  private onAttrHideLabelChanged(val: string) {
    if (val === 'false') {
      this.#containerEl.style.setProperty('--infoDisplay', 'block');
    }
    else {
      this.#containerEl.style.setProperty('--infoDisplay', 'none');
    }
  }

  private onContainerMouseDown(e: MouseEvent) {
    // disable scrolling on middle click
    e.preventDefault();

    this.#isProgrammaticalylScroll = true;
  }

  private onContainerMouseUp() {
    this.#isProgrammaticalylScroll = false;
  }


  private createContainer() {
    const el = document.createElement('div');
    el.classList.add('gallery-container');
    el.tabIndex = 0;

    el.addEventListener('mousedown', this.onContainerMouseDown);
    el.addEventListener('mouseup', this.onContainerMouseUp);
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

  private async redrawItemsTemplate(forced: boolean = false) {
    const scrollPos = this.#options.isHorizontal
      ? this.#containerEl.scrollLeft
      : this.#containerEl.scrollTop;

    let first = Math.trunc(scrollPos / this.itemRenderedSize - this.maxItemsOnScreen);
    first = first < 0 ? 0 : first;

    const isScrollChanged = Math.abs(scrollPos - this.#lastRepaintPos) > this.#maxBuffer;

    if (forced || !this.#lastRepaintPos || isScrollChanged) {
      this.#lastRepaintPos = scrollPos;
      this.renderItemsTemplate(first, this.#cachedItemsLength);
    }
  }

  private renderItemsTemplate(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    const indexesToRender = [] as number[];

    let toPos = fromPos + howMany;
    if (toPos > this.#options.items.length) {
      toPos = this.#options.items.length;
    }

    // for center alignment
    let firstPadding = 0;
    if (this.#options.items.length < this.maxItemsOnScreen) {
      firstPadding += this.containerSize / 2 - this.scrollingSize / 2;
    }

    for (let i = fromPos; i < toPos; i++) {
      let style = '';
      let cssClass = '';
      const itemPos = firstPadding + (i * this.itemRenderedSize);

      // set item position
      if (this.#options.isHorizontal) {
        style = `transform: translateX(${itemPos}px)`;
      }
      else {
        style = `transform: translateY(${itemPos}px)`;
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

      fragment.appendChild(itemEl.content.cloneNode(true));
      indexesToRender.push(i);
    }

    Array.from(fragment.children).forEach(n => {
      n.addEventListener('click', this.onItemClicked, true);
      n.addEventListener('auxclick', this.onItemAuxClicked, true);
      n.addEventListener('dblclick', this.onItemDoulbeClicked, true);

      // disable browser default context menu
      n.addEventListener('contextmenu', e => e.preventDefault(), true);
    });

    fragment.appendChild(this.#scrollerEl);

    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);

    // request render items
    this.#options.requestRenderItemsFn(indexesToRender);
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
    this.renderItemsTemplate(0, this.#cachedItemsLength / 2);
  }

  public renderItem(index: number, thumbnail: string) {
    const itemEl = this.#containerEl.querySelector(`.gallery-item[data-index="${index}"]`);
    if (itemEl === null) return;

    const imgEl = itemEl.querySelector('.preview > img') as HTMLImageElement;
    if (imgEl === null) return;


    const img = new Image();
    img.onload = () => itemEl.classList.remove('is--valid');
    img.onerror = () => itemEl.classList.add('is--invalid');
    img.src = thumbnail;
    img.alt = imgEl.alt;

    imgEl.replaceWith(img);
  }

  /**
   * Scrolls to item by the given index
   */
  public scrollToIndex(index: number) {
    // get center item position
    const itemPos = (index * this.itemRenderedSize) - (this.containerSize / 2);

    // use optimal scroll
    this.#isProgrammaticalylScroll = true;

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
      els.forEach(el => {
        el.classList.remove(CLASS_SELECTED);
        el.setAttribute('tabindex', '-1');
      });
    }

    // select the new items
    if (indexArr.length > 0) {
      const newSelectionQuery = indexArr
        .map(i => `[data-index="${i}"]`)
        .join(',');

      const els = this.#containerEl.querySelectorAll(newSelectionQuery);
      els.forEach((el, index) => {
        el.classList.add(CLASS_SELECTED);

        if (index === 0) {
          el.setAttribute('tabindex', '0');
        }
      });
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
