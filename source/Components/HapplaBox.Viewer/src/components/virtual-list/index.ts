
import BaseElement from '@/components/BaseElement';
import styles from '@/components/virtual-list/styles.inline.scss';
import thumbnailItemTemplate from '@/components/virtual-list/thumbnail-item.html';
import { compileTemplate } from '@/utils';
import ThumbnailItem from '@/components/virtual-list/thumbnailItem';

export interface VirtualListConfig {
  isHorizontal?: boolean;
  items: ThumbnailItem[];
}

const SELECTED_CLASS = 'selected';

const styleEl = document.createElement('style');
styleEl.textContent = styles;

export class VirtualList extends BaseElement {
  #isHorizontal = false;
  #lastRepaintPos: number = undefined;
  #maxBuffer = 0;

  #cachedItemsLength = 0;
  #containerEl: HTMLElement;
  #scrollerEl: HTMLElement;
  #resizeObserver: ResizeObserver;

  #items: ThumbnailItem[] = [];


  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // bind events
    this.onScroll = this.onScroll.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onResize = this.onResize.bind(this);

    // bind methods
    this.renderItems = this.renderItems.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.createScroller = this.createScroller.bind(this);
    this.setScrollerSize = this.setScrollerSize.bind(this);
    this.redrawItems = this.redrawItems.bind(this);

    this.load = this.load.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);

    this.#scrollerEl = this.createScroller();
    this.#containerEl = this.createContainer();
    this.shadowRoot.appendChild(this.#containerEl);

    this.#containerEl.addEventListener('scroll', this.onScroll);
    this.#containerEl.addEventListener('wheel', this.onMouseWheel, false);

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
    if (this.#isHorizontal) {
      return this.#containerEl.clientWidth;
    }

    return this.#containerEl.clientHeight;
  }

  get scrollingSize() {
    return this.itemRenderedSize * this.#items.length;
  }

  get maxItemsOnScreen() {
    return Math.ceil(this.containerSize / this.itemRenderedSize);
  }


  private connectedCallback() {
    this.style.setProperty('--hostOpacity', '1');
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }


  private onScroll(e: Event) {
    e.preventDefault();

    this.redrawItems();
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

  private onResize() {
    this.#cachedItemsLength = this.maxItemsOnScreen * 3;
    this.#maxBuffer = this.maxItemsOnScreen * this.itemRenderedSize;

    this.redrawItems(true);
  }


  private createContainer() {
    const el = document.createElement('div');
    el.classList.add('virtual-container');

    return el;
  }

  private createScroller() {
    const el = document.createElement('div');
    el.classList.add('virtual-scroller');

    el.style.top = '0';
    el.style.left = '0';

    return el;
  }

  private setScrollerSize(size: number) {
    if (!this.#scrollerEl) {
      return;
    }

    if (this.#isHorizontal) {
      this.#scrollerEl.style.width = `${size}px`;
      this.#scrollerEl.style.height = '1px';
    }
    else {
      this.#scrollerEl.style.width = '1px';
      this.#scrollerEl.style.height = `${size}px`;
    }
  }

  private redrawItems(forced: boolean = false) {
    const scrollPos = this.#isHorizontal ? this.#containerEl.scrollLeft : this.#containerEl.scrollTop;
    let first = Math.trunc(scrollPos / this.itemRenderedSize - this.maxItemsOnScreen);
    first = first < 0 ? 0 : first;

    const isScrollChanged = Math.abs(scrollPos - this.#lastRepaintPos) > this.#maxBuffer;

    if (forced || !this.#lastRepaintPos || isScrollChanged) {
      this.renderItems(first, this.#cachedItemsLength);
      this.#lastRepaintPos = scrollPos;
    }
  }

  private renderItems(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.#scrollerEl);

    let finalItem = fromPos + howMany;
    if (finalItem > this.#items.length) {
      finalItem = this.#items.length;
    }

    // for center alignment
    let firstPadding = 0;
    if (this.#items.length < this.maxItemsOnScreen) {
      firstPadding = this.containerSize / 2 - this.scrollingSize / 2;
    }

    for (let i = fromPos; i < finalItem; i++) {
      let style = '';
      const itemPos = firstPadding + (i * this.itemRenderedSize);

      if (this.#isHorizontal) {
        style = `left: ${itemPos}px`;
      }
      else {
        style = `top: ${itemPos}px`;
      }

      const itemEl = document.createElement('template');
      itemEl.innerHTML = compileTemplate(thumbnailItemTemplate, {
        ...this.#items[i],
        style,
        index: i,
      });

      fragment.appendChild(itemEl.content.cloneNode(true));
    }

    // eslint-disable-next-line no-param-reassign
    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);
  }


  /**
   * Loads items
   */
  public load(config: VirtualListConfig) {
    this.#isHorizontal = config.isHorizontal || false;
    this.#items = config.items;

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
      left: this.#isHorizontal ? itemPos : undefined,
      top: this.#isHorizontal ? undefined : itemPos,
      behavior: 'smooth',
    });
  }
}


export const initVirtualList = () => window.customElements.define('virtual-list', VirtualList);
