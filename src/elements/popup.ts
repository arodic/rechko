import {IoElement, RegisterIoElement, PropertiesDeclaration} from '@iogui/iogui';

export class RechkoPopup extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        background: var(--io-background-color);
        padding: 0 2em;
        top: 3.4em;
        opacity: 0;
        bottom: 0;
        left: 0;
        right: 0;
        will-change: transform;
        transform: translate3d(0, 200px, 0);
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
      }
      :host[show] {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      :host h3 {
        font-size: 1.4rem;
      }
      :host p {
        font-size: 1.1rem;
        line-height: 1.2em;
        margin: 0.5em 0;
      }
      :host > io-icon {
        position: absolute;
        top: 1em;
        right: 1em;
      }
    `;
  }
  static get Properties(): PropertiesDeclaration {
    return {
      show: {
        value: false,
        reflect: 1
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(()=>{
      this.show = true;
    });
  }
  onClose() {
    this.show = false;
    setTimeout(()=>{
      this.dispatchEvent('close');
    }, 250)
  }

  changed() {
    this.template([
      ['h3', 'Title'],
      ['p', 'Paragraph.'],
    ]);
  }
}

RegisterIoElement(RechkoPopup);