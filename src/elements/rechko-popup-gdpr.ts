import { IoStorage, RegisterIoElement } from 'io-gui';
import { $ShowGDPR, $CookiesRequired, $CookiesImprovement, $CookiesAnalitics } from '../game/state.js';
import {RechkoPopup} from './rechko-popup.js';

@RegisterIoElement
export class RechkoPopupGdpr extends RechkoPopup {
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
        --iotSpacing: 1em;
        --iotFieldHeight: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background-image: none !important;
        background-color: #6aaa64;
        border: none;
        border-radius: 4px;
        text-align: center;
      justify-content: center;
      }
      :host io-button:first-of-type {
        background-color: #ee5a34;
        margin-right: 1em;
      }
      :host io-switch {
        --iotLineHeight: 30px;
        --iotFieldHeight: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--iotBorderColor);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--iotBorderColor);
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
          font-size: 0.9em;
        }
        :host io-button io-label {
          font-size: 0.8em;
        }
      }
      @media (max-width: 360px) {
        :host .option > span {
          font-size: 0.7em;
        }
        :host io-button io-label {
          font-size: 0.6em;
        }
      }
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.$.accept?.focus();
  }
  decline = () => {
    $CookiesRequired.value = false;
    $CookiesImprovement.value = false;
    $CookiesAnalitics.value = false;
    this.onCloseClicked();
    setTimeout(()=> {
      $ShowGDPR.value = false;
    }, 500);
  };
  accept = () => {
    $CookiesRequired.value = true;
    IoStorage.permit();
    this.onCloseClicked();
    setTimeout(()=> {
      $ShowGDPR.value = false;
    }, 500);
    try {
      gtag('consent', 'update', {
        'analytics_storage': this.cookiesAnalitics ? 'granted' : 'denied',
        'ad_storage': this.cookiesAnalitics ? 'granted' : 'denied'
      });
    } catch(error) {
      console.warn(error);
    }
  };
  changed() {
    this.template([
      ['h3', 'Ова веб страница користи колачиће'],
      ['p', 'Користимо колачиће како би побољшали Речка. Сакупљамо речи које корисници открију да не постоје у постојећој бази.'],
      ['p', 'Страница користи и Google Analytics услуге. Сви подаци се користе искључиво у статистичке сврхе, за побољшање искуства играња и не деле се ни са једном компанијом, друштвом или неком трећом групом.'],
      ['div', {class: 'option'}, [
        ['span', 'Hеопходни колачићи'],
        ['io-switch', {value: true, disabled: true}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Cакупљање речи'],
        ['io-switch', {value: $CookiesImprovement}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Аналитички колачићи'],
        ['io-switch', {value: $CookiesAnalitics}],
      ]],
      ['div', {class: 'buttons'}, [
        ['io-button', {label: 'НЕ ПРИХВАТАМ', action: this.decline}],
        ['io-button', {label: 'ПРИХВАТАМ', id: 'accept', action: this.accept}],
      ]]
    ]);
  }
}