import {IoElement, RegisterIoElement} from '@iogui/iogui';

export class RechkoSettings extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        background: var(--io-background-color);
        padding: 2em;
        top: 3.4em;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
      }
      :host h3 {
        font-size: 1.4rem;
      }
      :host p {
        font-size: 1.1rem;
        line-height: 1.2em;
        margin: 0.5em 0;
      }
      :host .switchbox {
        text-align: left;
        white-space: nowrap;
        margin: 2em;
      }
      :host io-icon {
        position: absolute;
        top: 1em;
        right: 1em;
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
  onClose() {
    this.dispatchEvent('close');
  }
  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
      ['h3', 'Подешавања'],
      ['div', {class: 'switchbox'}, [
        // ['div', [
        //   ['io-switch', {value: this.bind('hardMode')}],
        //   ['io-item', 'тежак режим игре'],
        // ]],
        ['div', [
          ['io-switch', {value: this.bind('darkTheme')}],
          ['io-item', 'ноћни режим боја'],
        ]],
        ['div', [
          ['io-switch', {value: this.bind('colorblindMode')}],
          ['io-item', 'режим боја за далтонисте'],
        ]]
      ]]
    ]);
  }
}

RegisterIoElement(RechkoSettings);