import {RegisterIoElement} from '@iogui/iogui';
import {RechkoPopup} from './popup';

export class RechkoSettings extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host io-switch {
        --io-line-height: 30px;
        --io-item-height: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--io-color-border);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--io-color-border);
      }
      :host .option > span {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host .option > io-switch {
        margin-top: 1em;
        flex-shrink: 0;
      }
      :host .option > io-button {
        --io-spacing: 1em;
        --io-item-height: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background: var(--io-background-color-light);
        border: none;
        margin-top: 0.5em;
        border-radius: 4px;
      }
    `;
  }
  static get Properties() {
    return {
      hardMode: false,
      darkTheme: false,
      colorblindMode: false,
      cookiesRequired: true,
    }
  }
  onShowGDPR() {
    this.dispatchEvent('show-gdpr');
    this.onClose();
  }
  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
      ['h3', 'Подешавања'],
      ['div', {class: 'option'}, [
        ['span', 'Тамна тема'],
        ['io-switch', {value: this.bind('darkTheme')}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Боје високог контраста'],
        ['io-switch', {value: this.bind('colorblindMode')}],
      ]],
      ['div', {class: 'option'}, [
        ['io-button', {label: 'Подешавање колачића', action: this.onShowGDPR}],
      ]],

    ]);
  }
}

RegisterIoElement(RechkoSettings);