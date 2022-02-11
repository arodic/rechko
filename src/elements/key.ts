import {IoElement, RegisterIoElement} from '@iogui/iogui';

export class RechkoKey extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: 0 6px 0 0;
        display: flex;
        flex: 1;
      }
      :host button {
        font-family: inherit;
        font-weight: bold;
        border: 0;
        height: 58px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        background-color: var(--io-background-color);
        color: var(--io-color-light);
        border: 1px solid var(--io-color-border);
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
        /* transition: all .2s 1.5s; */
      }
      :host io-icon {
        margin: auto;
        fill: #444;
      }
      :host[big] {
        flex: 1.5;
      }
      :host:last-of-type {
        margin: 0;
      }
      :host[state=correct] button,
      :host[state=present] button,
      :host[state=absent] button {
        color: var(--io-color-light) !important;
      }
      :host[state=correct] button {
        background-color: #6aaa64 !important;
      }
      :host[state=present] button {
        background-color: #c9b458 !important;
      }
      :host[state=absent] button {
        background-color: var(--io-background-color-dark) !important;
      }
    `;
  }
  static get Properties() {
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
    }
  }
  onClick(event: MouseEvent) {
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
