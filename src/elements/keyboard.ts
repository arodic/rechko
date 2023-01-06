import {IoElement, RegisterIoElement} from 'io-gui';
import { $ColorblindMode } from '../game/state.js';
import './key.js';

const rows = [
  'љњертзуиопш'.split(''),
  'асдфгхјклчћ'.split(''),
  ['Enter', ...'џцвбнмђж'.split(''), 'Backspace']
];

@RegisterIoElement
export class RechkoKeyboard extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        margin: 1em 1em 1em 1em;
        user-select: none;
      }
      :host > div {
        display: flex;
        width: 100%;
        margin: 0 auto 3px;
        touch-action: manipulation;
      }
      :host[colorblind] rechko-key[state=correct] button {
        background-color: #f5793a !important;
      }
      :host[colorblind] rechko-key[state=present] button {
        background-color: #85c0f9 !important;
      }
      @media (max-width: 360px) {
        :host {
          margin: 0.25em 0.25em 0.25em 0.25em;
        }
      }
    `;
  }
  static get Properties(): any {
    return {
      letterStates: {
        type: Object,
        observe: true
      },
      translate: {
        value: 'no',
        reflect: true
      },
      colorblind: {
        binding: $ColorblindMode,
        reflect: true
      }
    };
  }
  changed() {
    this.template(rows.map(row => {
      return ['div', row.map(key => {
        return ['rechko-key', {key: key, state: this.letterStates[key] || ''}];
      })];
    }));
  }
}