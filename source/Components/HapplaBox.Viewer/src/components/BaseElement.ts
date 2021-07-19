
export default class BaseElement extends HTMLElement {
  public closestElement(selector: string, el = this): Element {
    // @ts-ignore
    return (el && el !== document && el !== window && el.closest(selector))
      // @ts-ignore
      || this.closestElement(selector, el.getRootNode().host);
  }
}
