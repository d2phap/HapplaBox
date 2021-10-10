
import { compileTemplate } from '@/utils';

import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import imgTemplate from './imgTemplate.html';
import { Board } from './board';
import { BoardOptions, ZoomMode } from './types';


export class HbBoard extends BaseElement {
  #board: Board;
  #resizeObserver: ResizeObserver;

  #containerEl: HTMLDivElement;
  #wrapperEl: HTMLDivElement;
  #contentEl: HTMLDivElement;

  constructor() {
    super();

    // private methods
    this.createTemplate = this.createTemplate.bind(this);

    // private events
    this.onAuxClicked = this.onAuxClicked.bind(this);
    this.onResize = this.onResize.bind(this);

    // initialize template
    this.createTemplate();

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private onResize() {
    //
  }

  private onAuxClicked(e: PointerEvent) {
    e.stopPropagation();

    // right click
    if (e.button === 2) {
      // todo
    }
  }

  private createTemplate() {
    // initialize component
    this.attachShadow({ mode: 'open' });

    const css = new CSSStyleSheet();
    // @ts-ignore
    css.replaceSync(styles);
    // @ts-ignore
    this.shadowRoot.adoptedStyleSheets = [css];


    // content
    const contentEl = document.createElement('div');
    contentEl.classList.add('board-content');

    // wrapper
    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('board-wrapper');
    wrapperEl.appendChild(contentEl);

    // container
    const containerEl = document.createElement('div');
    containerEl.classList.add('board-container');
    containerEl.appendChild(wrapperEl);

    // disable browser default context menu
    containerEl.addEventListener('contextmenu', e => e.preventDefault(), true);
    containerEl.addEventListener('auxclick', this.onAuxClicked, true);


    this.#contentEl = contentEl;
    this.#wrapperEl = wrapperEl;
    this.#containerEl = containerEl;

    this.shadowRoot.appendChild(this.#containerEl);
  }


  public async initBoard(options: BoardOptions = {}) {
    this.#board = new Board(this.#containerEl, this.#contentEl, options);

    this.#board.enable();
  }

  public async loadImage(url: string) {
    this.#wrapperEl.classList.remove('opacity-1');
    this.#contentEl.innerHTML = compileTemplate(imgTemplate, {
      src: url,
      title: '',
    });

    await this.#board.waitForContentReady();
    await this.SetZoomMode();

    this.#wrapperEl.classList.add('opacity-1');
  }

  public async SetZoomMode(mode: ZoomMode = ZoomMode.ScaleToFit) {
    if (mode === ZoomMode.ScaleToFit) {
      const w = this.#contentEl.scrollWidth / this.#board.scaleRatio;
      const h = this.#contentEl.scrollHeight / this.#board.scaleRatio;

      const widthScale = this.#containerEl.clientWidth / w;
      const heightScale = this.#containerEl.clientHeight / h;
      const scale = Math.min(widthScale, heightScale);

      const x = (this.#containerEl.offsetWidth - (w * scale)) / 2;
      const y = (this.#containerEl.offsetHeight - (h * scale)) / 2;

      await this.#board.panTo(-w / 2, -h / 2);
      this.#board.zoomTo(scale, x, y);
    }
  }
}

export const init = () => window.customElements.define('hb-board', HbBoard);

