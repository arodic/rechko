import {IoElement, RegisterIoElement} from 'io-gui';

export class RechkoKey extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: 0 3px 0 0;
        display: flex;
        flex: 1 0 auto;
      }
      :host button {
        font-family: inherit;
        font-weight: bold;
        border: 0;
        height: 58px;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        user-select: none;
        background-color: var(--io-background-color-dark);
        color: var(--io-color);
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
      }
      :host io-icon {
        margin: auto;
        fill: var(--io-color);
      }
      :host[big] {
        flex: 3;
      }
      :host:last-of-type {
        margin: 0;
      }
      :host[state=correct] button,
      :host[state=present] button,
      :host[state=absent] button {
        color: white !important;
      }
      :host[state=correct] button {
        background-color: #6aaa64 !important;
      }
      :host[state=present] button {
        background-color: #c9b458 !important;
      }
      :host[state=absent] button {
        background-color: var(--io-background-color-light) !important;
      }
    `;
  }
  static get Properties(): any {
    return {
      key: '',
      big: {
        value: false,
        reflect: 1,
      },
      state: {
        value: '',
        reflect: 1,
      }
    };
  }
  onClick() {
    this.dispatchEvent('key', this.key, true);
  }
  keyChanged() {
    this.big = this.key.length > 1;
  }
  changed() {
    this.template([['button', {'on-click': this.onClick}, [
      this.key !== 'Backspace' ?
      ['span', this.key] :
      ['io-icon', {icon: 'buttons:backspace'}]
    ]]]);
  }
}

RegisterIoElement(RechkoKey);
