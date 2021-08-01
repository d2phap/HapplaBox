
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
    this.#totalRows = config.totalItems;
    this.#totalHeight = this.itemRenderedSize * this.#totalRows;

    this.#screenItemsLength = Math.ceil(
      this.#isHorizontal
        ? this.#containerEl.clientWidth / this.itemRenderedSize
        : this.#containerEl.clientHeight / this.itemRenderedSize,
    );
    this.#cachedItemsLength = this.#screenItemsLength * 3;
    this.#maxBuffer = this.#screenItemsLength * this.itemRenderedSize;

    this.setScrollerSize(this.#totalHeight);
    this.renderChunk(0, this.#cachedItemsLength / 2);
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

  private renderChunk(fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.#scrollerEl);

    let finalItem = fromPos + howMany;
    if (finalItem > this.#totalRows) {
      finalItem = this.#totalRows;
    }

    for (let i = fromPos; i < finalItem; i++) {
      let left = '';
      let top = '';

      if (this.#isHorizontal) {
        left = `${i * this.itemRenderedSize}`;
      }
      else {
        top = `${i * this.itemRenderedSize}`;
      }

      const itemHtml = compileTemplate(thumbnailItemTemplate, {
        left,
        top,
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

  private onScroll(e: Event) {
    e.preventDefault();
    const el = e.target as HTMLElement;

    const scrollPos = this.#isHorizontal ? el.scrollLeft : el.scrollTop;
    let first = Math.trunc(scrollPos / this.itemRenderedSize - this.#screenItemsLength);
    first = first < 0 ? 0 : first;

    if (!this.#lastRepaintY || Math.abs(scrollPos - this.#lastRepaintY) > this.#maxBuffer) {
      this.renderChunk(first, this.#cachedItemsLength);
      this.#lastRepaintY = scrollPos;
    }
  }
}


export const initVirtualList = () => window.customElements.define('virtual-list', VirtualList);
