
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
    containerEl.tabIndex = 0;
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


  public initBoard(options: BoardOptions = {}) {
    this.#board = new Board(this.#containerEl, this.#contentEl, options);

    this.#board.enable();
  }

  public async loadImage(url: string, zoomMode: ZoomMode = ZoomMode.AutoZoom) {
    this.#wrapperEl.classList.remove('opacity-1');
    this.#contentEl.innerHTML = compileTemplate(imgTemplate, {
      src: url,
      title: '',
    });

    await this.#board.waitForContentReady();
    await this.setZoomMode(zoomMode);

    this.#wrapperEl.classList.add('opacity-1');
  }

  public async setZoomMode(mode: ZoomMode = ZoomMode.AutoZoom) {
    const fullW = this.#contentEl.scrollWidth / this.#board.scaleRatio;
    const fullH = this.#contentEl.scrollHeight / this.#board.scaleRatio;
    const horizontalPadding = this.#board.padding.left + this.#board.padding.right;
    const verticalPadding = this.#board.padding.top + this.#board.padding.bottom;
    const widthScale = (this.#containerEl.clientWidth - horizontalPadding) / fullW;
    const heightScale = (this.#containerEl.clientHeight - verticalPadding) / fullH;
    let zoomFactor = 1;

    if (mode === ZoomMode.ScaleToWidth) {
      zoomFactor = widthScale;
    }
    else if (mode === ZoomMode.ScaleToHeight) {
      zoomFactor = heightScale;
    }
    else if (mode === ZoomMode.ScaleToFit) {
      zoomFactor = Math.min(widthScale, heightScale);
    }
    else if (mode === ZoomMode.ScaleToFill) {
      zoomFactor = Math.max(widthScale, heightScale);
    }
    else if (mode === ZoomMode.LockZoom) {
      zoomFactor = this.#board.zoomFactor;
    }
    // AutoZoom
    else {
      // viewport size >= content size
      if (widthScale >= 1 && heightScale >= 1) {
        zoomFactor = 1; // show original size
      }
      else {
        zoomFactor = Math.min(widthScale, heightScale);
      }
    }

    this.#board.zoomTo(zoomFactor);
  }
}

export const init = () => window.customElements.define('hb-board', HbBoard);

