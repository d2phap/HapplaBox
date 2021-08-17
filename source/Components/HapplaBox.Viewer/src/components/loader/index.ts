
import BaseElement from '../BaseElement';
import styles from './styles.inline.scss';
import template from './template.html';


export class HbLoader extends BaseElement {
  #thickness = '3'; // max: 10
  #resizeObserver: ResizeObserver;

  constructor() {
    super();

    // initialize component
    this.attachShadow({ mode: 'open' });

    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;
    this.shadowRoot.appendChild(templateEl.content.cloneNode(true));

    const css = new CSSStyleSheet();
    // @ts-ignore
    css.replaceSync(styles);
    // @ts-ignore
    this.shadowRoot.adoptedStyleSheets = [css];

    this.onAttrThicknessChanged = this.onAttrThicknessChanged.bind(this);
    this.onResize = this.onResize.bind(this);

    // resize event observer
    this.#resizeObserver = new ResizeObserver(this.onResize);
    this.#resizeObserver.observe(this.shadowRoot.host);
  }

  static get observedAttributes() {
    return ['thickness'];
  }

  private disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) {
      return;
    }

    if (name === 'thickness') {
      this.onAttrThicknessChanged(newVal);
    }
  }

  private onAttrThicknessChanged(val: string) {
    const value = val.trim();

    if (!Number.isNaN(value)) {
      this.#thickness = value;

      const el = this.shadowRoot.querySelector('circle.path');
      el.setAttribute('stroke-width', this.#thickness);
    }
  }

  private onResize() {
    const loaderEl = this.shadowRoot.querySelector('.loader') as HTMLDivElement;
    loaderEl.style.width = `${this.shadowRoot.host.clientWidth}px`;
  }
}

export const init = () => window.customElements.define('hb-loader', HbLoader);
