import {IoElement, RegisterIoElement} from '@iogui/iogui';

export class RechkoGdpr extends IoElement {
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
      }
      :host h3 {
        font-size: 1.4rem;
      }
      :host p {
        font-size: 1.1rem;
        line-height: 1.2em;
        margin: 0.5em 0;
      }
      :host p:last-of-type {
        flex: 1;
      }
      :host io-button {
        --io-spacing: 1em;
        --io-item-height: 3.5em;
        width: 10em;
        margin: 1em 0.25em;
        padding-left: 0;
        padding-right: 0;
        font-weight: bold;
        color: var(--io-color-light);
        background: rgb(30, 185, 50);
      }
      :host io-button:first-of-type {
        background: rgb(225, 90, 60);
      }
      :host .switchbox {
        text-align: left;
        white-space: nowrap;
        margin: 2em;
      }
      @media (max-width: 500px) {
        :host h3 {
          font-size: 1.2rem;
          margin: 0.5em 0;
        }
        :host p {
          font-size: 0.9rem;
          margin: 0.5em 0;
        }
        :host io-button {
          margin: 0.25em;
        }
      }
      @media (max-width: 450px) {
        :host .switchbox {
          margin: 2em 0em;
        }
      }
    `;
  }
  static get Properties() {
    return {
      cookiesRequired: true,
      cookiesImprovement: true,
      cookiesAnalitics: true,
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.$.accept?.focus();
  }
  onDecline() {
    // TODO: iogui - this should work!
    // It appears as if the first change eventt dispatch makes
    // RechkoApp.changed() reset values for other two.
    // this.setProperties({
    //   cookiesRequired: false,
    //   cookiesImprovement: false,
    //   cookiesAnalitics: false
    // });
    this.cookiesRequired = false;
    this.cookiesImprovement = false;
    this.cookiesAnalitics = false;
    this.onAccept();
  }
  onAccept() {
    setTimeout(()=> {
      this.dispatchEvent('close');
    }, 500);
  }
  changed() {
    this.template([
      ['h3', 'Ова веб страница користи колачиће'],
      ['p', 'Користимо колачиће како би побољшали Речка.'],
      ['p', 'Сакупљамо речи које корисници открију да не постоје у постојећој бази.'],
      ['p', 'Страница такође користи и Google Analytics услуге. Сви подаци се користе искључиво у статистичке сврхе, за побољшање искуства играња и не деле се ни са једном компанијом, друштвом или неком трећом групом.'],
      ['div', {class: 'switchbox'}, [
        ['div', [
          ['io-switch', {value: this.bind('cookiesRequired'), disabled: true}],
          ['io-item', 'Hеопходни колачићи']
        ]],
        ['div', [
          ['io-switch', {value: this.bind('cookiesImprovement')}],
          ['io-item', 'Cакупљање унетих речи']
        ]],
        ['div', [
          ['io-switch', {value: this.bind('cookiesAnalitics')}],
          ['io-item', 'Аналитички колачићи']
        ]],
      ]],
      ['div', [
        ['io-button', {label: 'НЕ ПРИХВАТАМ', action: this.onDecline}],
        ['io-button', {label: 'ПРИХВАТАМ', id: 'accept', action: this.onAccept}],
      ]]
    ]);
  }
}

RegisterIoElement(RechkoGdpr);