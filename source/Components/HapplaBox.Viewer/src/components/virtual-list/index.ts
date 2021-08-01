
import BaseElement from '@/components/BaseElement';
import styles from '@/components/virtual-list/styles.inline.scss';

export interface VirtualListConfig {
  w: number;
  h: number;
  isHorizontal: boolean;
  itemHeight: number;
  totalRows: number;
  generatorFn: (rowIndex: number) => HTMLElement;
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
  #generatorFn: (rowIndex: number) => HTMLElement;
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
    this.onScroll = this.onScroll.bind(this);
    this.load = this.load.bind(this);
  }

  get container() {
    return this.#containerEl;
  }

  load(config: VirtualListConfig) {
    this.#isHorizontal = config.isHorizontal || false;
    this.#itemHeight = config.itemHeight;

    this.#generatorFn = config.generatorFn;
    this.#totalRows = config.totalRows;

    this.#totalHeight = this.#itemHeight * this.#totalRows;
    this.#screenItemsLength = Math.ceil(this.#isHorizontal ? config.w : config.h / this.#itemHeight);
    this.#cachedItemsLength = this.#screenItemsLength * 3;
    this.#maxBuffer = this.#screenItemsLength * this.#itemHeight;

    this.#scrollerEl = this.createScroller(this.#totalHeight.toString());
    this.#containerEl = this.createContainer();
    this.#containerEl.addEventListener('scroll', this.onScroll);

    this.renderChunk(this.#containerEl, 0, this.#cachedItemsLength / 2);

    this.shadowRoot.appendChild(this.#containerEl);
  }

  renderChunk(node: Element, fromPos: number, howMany: number) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.#scrollerEl);

    let finalItem = fromPos + howMany;
    if (finalItem > this.#totalRows) {
      finalItem = this.#totalRows;
    }

    for (let i = fromPos; i < finalItem; i++) {
      const item = this.#generatorFn(i);
      item.classList.add('virtual-row');

      if (this.#isHorizontal) {
        item.style.left = `${i * this.#itemHeight}px`;
      }
      else {
        item.style.top = `${i * this.#itemHeight}px`;
      }

      fragment.appendChild(item);
    }

    // eslint-disable-next-line no-param-reassign
    node.innerHTML = '';
    node.appendChild(fragment);
  }

  createContainer() {
    const el = document.createElement('div');
    el.classList.add('virtual-container');

    if (this.#isHorizontal) {
      el.classList.add('direction--horizontal');
    }

    return el;
  }

  createScroller(height: string) {
    const el = document.createElement('div');
    el.classList.add('virtual-scroller');

    el.style.top = '0';
    el.style.left = '0';

    if (this.#isHorizontal) {
      el.style.width = `${height}px`;
      el.style.height = '1px';
    }
    else {
      el.style.width = '1px';
      el.style.height = `${height}px`;
    }

    return el;
  }

  onScroll(e: Event) {
    // @ts-ignore
    const scrollTop = e.target.scrollTop as number;
    let first = parseInt(`${scrollTop / this.#itemHeight}`, 10) - this.#screenItemsLength;
    first = first < 0 ? 0 : first;

    if (!this.#lastRepaintY || Math.abs(scrollTop - this.#lastRepaintY) > this.#maxBuffer) {
      this.renderChunk(this.#containerEl, first, this.#cachedItemsLength);
      this.#lastRepaintY = scrollTop;
    }

    e.preventDefault();
  }
}


export const initVirtualList = () => window.customElements.define('virtual-list', VirtualList);
