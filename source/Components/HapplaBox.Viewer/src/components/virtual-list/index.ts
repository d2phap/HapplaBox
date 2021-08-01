
import BaseElement from '@/components/BaseElement';
import styles from '@/components/virtual-list/styles.inline.scss';
import thumbnailItemTemplate from '@/components/virtual-list/thumbnail-item.html';
import ThumbnailItem from '@/components/virtual-list/thumbnailItem';
import { compileTemplate } from '@/utils';

export interface VirtualListConfig {
  isHorizontal?: boolean;
  itemHeight: number;
  totalRows: number;
}

// const rootEl = document.createElement('template');
// rootEl.innerHTML = template;

const styleEl = document.createElement('style');
styleEl.textContent = styles;

export class VirtualList extends BaseElement {
  #isHorizontal = false;
  #screenItemsLength = 0;
  #lastRepaintY: number = undefined;
  #maxBuffer = 0;

  // Cache 4 times the number of items that fit in the container viewport
  #cachedItemsLength = 0;
  #containerEl: HTMLElement;
  #scrollerEl: HTMLElement;

  #itemHeight = 0;
  #totalHeight = 0;
  #totalRows = 0;

  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    // this.shadowRoot.appendChild(rootEl.content.cloneNode(true));

    this.renderChunk = this.renderChunk.bind(this);
    this.createContainer = this.createContainer.bind(this);
    this.createScroller = this.createScroller.bind(this);
    this.setScrollerSize = this.setScrollerSize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.load = this.load.bind(this);

    this.#scrollerEl = this.createScroller();
    this.#containerEl = this.createContainer();
    this.shadowRoot.appendChild(this.#containerEl);

    this.#containerEl.addEventListener('scroll', this.onScroll);
  }

  get container() {
    return this.#containerEl;
  }

  private connectedCallback() {
    this.style.setProperty('--hostOpacity', '1');
  }

  load(config: VirtualListConfig) {
    this.#isHorizontal = config.isHorizontal || false;
    this.#itemHeight = config.itemHeight;

    this.#totalRows = config.totalRows;
    this.#totalHeight = this.#itemHeight * this.#totalRows;

    this.#screenItemsLength = Math.ceil(
      this.#isHorizontal
        ? this.#containerEl.clientWidth
        : this.#containerEl.clientHeight / this.#itemHeight,
    );
    this.#cachedItemsLength = this.#screenItemsLength * 3;
    this.#maxBuffer = this.#screenItemsLength * this.#itemHeight;

    this.setScrollerSize(this.#totalHeight);
    this.renderChunk(0, this.#cachedItemsLength / 2);
  }

  // updateDirection() {
  //   this.#screenItemsLength = Math.ceil(this.#isHorizontal
  // ? config.w : config.h / this.#itemHeight);

  //   if (this.#isHorizontal) {
  //     this.#screenItemsLength = Math.ceil(this.#isHorizontal
  // ? config.w : config.h / this.#itemHeight);
  //     this.#containerEl.classList.add('direction--horizontal');
  //   }
  //   else {
  //     this.#containerEl.classList.remove('direction--horizontal');
  //   }
  // }

  createContainer() {
    const el = document.createElement('div');
    el.classList.add('virtual-container');

    return el;
  }

  createScroller() {
    const el = document.createElement('div');
    el.classList.add('virtual-scroller');

    el.style.top = '0';
    el.style.left = '0';

    return el;
  }

  setScrollerSize(size: number) {
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

  renderChunk(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.#scrollerEl);

    let finalItem = fromPos + howMany;
    if (finalItem > this.#totalRows) {
      finalItem = this.#totalRows;
    }

    for (let i = fromPos; i < finalItem; i++) {
      const size = this.#itemHeight;
      let left = '';
      let top = '';

      if (this.#isHorizontal) {
        left = `${i * (size + 11)}`;
      }
      else {
        top = `${i * (size + 11)}`;
      }

      const itemHtml = compileTemplate(thumbnailItemTemplate, {
        size, left, top,
        src: `https://picsum.photos/seed/pic${i}/300/200`,
        tooltip: `Pic ${i + 1}`,
        name: `Picture ${i + 1}`,
      });

      const itemEl = document.createElement('template');
      itemEl.innerHTML = itemHtml;

      fragment.appendChild(itemEl.content.cloneNode(true));
    }

    // eslint-disable-next-line no-param-reassign
    this.#containerEl.innerHTML = '';
    this.#containerEl.appendChild(fragment);
  }

  onScroll(e: Event) {
    // @ts-ignore
    const scrollTop = e.target.scrollTop as number;
    let first = parseInt(`${scrollTop / this.#itemHeight}`, 10) - this.#screenItemsLength;
    first = first < 0 ? 0 : first;

    if (!this.#lastRepaintY || Math.abs(scrollTop - this.#lastRepaintY) > this.#maxBuffer) {
      this.renderChunk(first, this.#cachedItemsLength);
      this.#lastRepaintY = scrollTop;
    }

    e.preventDefault();
  }
}


export const initVirtualList = () => window.customElements.define('virtual-list', VirtualList);
