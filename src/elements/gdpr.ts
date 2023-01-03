import {RegisterIoElement} from 'io-gui';
import {RechkoPopup} from './popup';

export class RechkoGdpr extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host {
        z-index: 100;
      }
      :host p:last-of-type {
        margin-bottom: 2em;
      }
      :host .buttons {
        display: flex;
        margin: 2em 0;
      }
      :host io-button {
        --io-spacing: 1em;
        --io-item-height: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background: #6aaa64;
        border: none;
        border-radius: 4px;
      }
      :host io-button:first-of-type {
        background: #ee5a34;
        margin-right: 1em;
      }
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
      @media (max-width: 500px) {
        :host p {
          margin: 0.5em 0;
        }
        :host io-button {
          font-size: 0.7em;
          line-height: 1.4em;
        }
      }
      @media (max-width: 360px) {
        :host io-button {
          font-size: 0.6em;
          line-height: 1.6em;
        }
        :host .option span {
          font-size: 0.7em;
          line-height: 4em;
        }
      }
    `;
  }
  static get Properties(): any {
    return {
      cookiesRequired: true,
      cookiesImprovement: true,
      cookiesAnalitics: true,
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.cookiesRequired = true;
    this.$.accept?.focus();
  }
  onDecline() {
    // TODO: iogui - this should work!
    // It appears as if the first change eventt dispatch makes
    // RechkoApp.changed() reset values for other two.
    this.setProperties({
      cookiesRequired: false,
      cookiesImprovement: false,
      cookiesAnalitics: false
    });
    // this.cookiesRequired = false;
    // this.cookiesImprovement = false;
    // this.cookiesAnalitics = false;
    this.onAccept();
  }
  onAccept() {
    setTimeout(()=> {
      this.onClose();
    }, 500);
  }
  changed() {
    this.template([
      ['h3', 'Ова веб страница користи колачиће'],
      ['p', 'Користимо колачиће како би побољшали Речка. Сакупљамо речи које корисници открију да не постоје у постојећој бази.'],
      ['p', 'Страница користи и Google Analytics услуге. Сви подаци се користе искључиво у статистичке сврхе, за побољшање искуства играња и не деле се ни са једном компанијом, друштвом или неком трећом групом.'],
      ['div', {class: 'option'}, [
        ['span', 'Hеопходни колачићи'],
        ['io-switch', {value: this.bind('cookiesRequired'), disabled: true}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Cакупљање речи'],
        ['io-switch', {value: this.bind('cookiesImprovement')}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Аналитички колачићи'],
        ['io-switch', {value: this.bind('cookiesAnalitics')}],
      ]],
      ['div', {class: 'buttons'}, [
        ['io-button', {label: 'НЕ ПРИХВАТАМ', action: this.onDecline}],
        ['io-button', {label: 'ПРИХВАТАМ', id: 'accept', action: this.onAccept}],
      ]]
    ]);
  }
}

RegisterIoElement(RechkoGdpr);