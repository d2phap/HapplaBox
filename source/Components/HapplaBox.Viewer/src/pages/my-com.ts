const template = document.createElement('template');

template.innerHTML = `
  <style>
    div {
      margin-top: 20px;
      color: green;
    }
  </style>
  <div>
    <p>The Google search result of your name is <a target="_blank" rel="noopener">here</a></p>
  </div>
`;

class MyComp extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('a').href = '';
  }

  static get observedAttributes() {
    return ['name-attribute'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'name-attribute') {
      this.shadowRoot.querySelector('a')
        .href = `https://www.google.com/search?q=${newValue}`;
    }
  }
}

window.customElements.define('my-com', MyComp);
