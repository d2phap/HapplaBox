
import BaseElement from '@/components/BaseElement';
import styles from '@/components/virtual-list/styles.inline.scss';
import thumbnailItemTemplate from '@/components/virtual-list/thumbnail-item.html';
import { compileTemplate } from '@/utils';

export interface VirtualListConfig {
  isHorizontal?: boolean;
  totalItems: number;
}

const SELECTED_CLASS = 'selected';

const styleEl = document.createElement('style');
styleEl.textContent = styles;

export class VirtualList extends BaseElement {
  #isHorizontal = false;
  #screenItemsLength = 0;
  #lastRepaintY: number = undefined;
  #maxBuffer = 0;

  #cachedItemsLength = 0;
  #containerEl: HTMLElement;
  #scrollerEl: HTMLElement;
  #totalHeight = 0;
  #totalRows = 0;

  get itemSize() {
    const rootStyle = getComputedStyle(document.body);

    return parseInt(rootStyle.getPropertyValue('--thumbnailSize').trim(), 10);
  }

  get itemRenderedSize() {
    return this.itemSize + 11;
  }

  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);

    // bind events
    this.onScroll = this.onScroll.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);

    // bind methods
    this.renderItems = this.renderItems.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.createScroller = this.createScroller.bind(this);
    this.setScrollerSize = this.setScrollerSize.bind(this);
    this.load = this.load.bind(this);

    this.#scrollerEl = this.createScroller();
    this.#containerEl = this.createContainer();
    this.shadowRoot.appendChild(this.#containerEl);

    this.#containerEl.addEventListener('scroll', this.onScroll);
    this.#containerEl.addEventListener('wheel', this.onMouseWheel, false);
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

  private connectedCallback() {
    this.style.setProperty('--hostOpacity', '1');
  }

  load(config: VirtualListConfig) {
    this.#isHorizontal = config.isHorizontal || false;
    this.#totalRows = config.totalItems;
    this.#totalHeight = this.itemRenderedSize * this.#totalRows;

    this.#screenItemsLength = Math.ceil(this.containerSize / this.itemRenderedSize);
    this.#cachedItemsLength = this.#screenItemsLength * 3;
    this.#maxBuffer = this.#screenItemsLength * this.itemRenderedSize;

    this.setScrollerSize(this.#totalHeight);
    this.renderItems(0, this.#cachedItemsLength / 2);
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

  private renderItems(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.#scrollerEl);

    let finalItem = fromPos + howMany;
    if (finalItem > this.#totalRows) {
      finalItem = this.#totalRows;
    }

    // for center alignment
    let firstPadding = 0;
    if (this.#totalRows < this.#screenItemsLength) {
      firstPadding = this.containerSize / 2 - this.#totalHeight / 2;
    }

    for (let i = fromPos; i < finalItem; i++) {
      let style = '';

      if (this.#isHorizontal) {
        const left = firstPadding + i * this.itemRenderedSize;
        style = `left: ${left}px`;
      }
      else {
        const top = firstPadding + i * this.itemRenderedSize;
        style = `top: ${top}px`;
      }

      const itemHtml = compileTemplate(thumbnailItemTemplate, {
        style,
        index: i,
        src: `https://picsum.photos/seed/pic${i}/300/200`,
        tooltip: `Pic ${i + 1}`,
        name: `P${i + 1}`,
      });

      const itemEl = document.createElement('template');
      itemEl.innerHTML = itemHtml;

      fragment.appendChild(itemEl.content.cloneNode(true));
    }

    // eslint-disable-next-line no-param-reassign
    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);
  }

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

  private onScroll(e: Event) {
    e.preventDefault();
    const el = e.target as HTMLElement;

    const scrollPos = this.#isHorizontal ? el.scrollLeft : el.scrollTop;
    let first = Math.trunc(scrollPos / this.itemRenderedSize - this.#screenItemsLength);
    first = first < 0 ? 0 : first;

    if (!this.#lastRepaintY || Math.abs(scrollPos - this.#lastRepaintY) > this.#maxBuffer) {
      this.renderItems(first, this.#cachedItemsLength);
      this.#lastRepaintY = scrollPos;
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
}


export const initVirtualList = () => window.customElements.define('virtual-list', VirtualList);
