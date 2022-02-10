import {IoElement, RegisterIoElement} from '@iogui/iogui';
export { RechkoKey } from './key.js';

const rows = [
  'љњертзуиопш'.split(''),
  'асдфгхјклчћ'.split(''),
  ['Enter', ...'џцвбнмђж'.split(''), 'Backspace']
]

export class RechkoKeyboard extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        margin: 30px 6px 8px 6px;
        user-select: none;
      }
      :host > div {
        display: flex;
        width: 100%;
        margin: 0 auto 8px;
        touch-action: manipulation;
      }
    `;
  }
  static get Properties() {
    return {
      letterStates: {
        type: Object,
        observe: true
      },
      translate: {
        value: "no",
        reflect: 1
      }
    }
  }
  changed() {
    this.template(rows.map(row => {
      return ['div', row.map(key => {
        return ['rechko-key', {key: key, state: this.letterStates[key] || ''}];
      })]
    }));
  }
}

RegisterIoElement(RechkoKeyboard);