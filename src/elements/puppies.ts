import {RegisterIoElement} from '@iogui/iogui';
import {RechkoPopup} from './popup';


export class RechkoPuppies extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host h3 {
        margin: 1.2em 0;
        font-size: 1rem;
        padding: 0 1em;
      }
      :host > div.puppies > img {
        width: 50%;
      }

      :host > div.rajka > div {
        padding-bottom: 1em;
      }

      :host > div.rajka p {
        text-align: left;
        font-size: 0.8em !important;
      }
      :host > div.rajka {
        display: flex;
        flex-direction: column;
      }
      :host > div.rajka > img {
        width: 100%;
        padding-bottom: 1em;
      }
      :host > button {
        margin: 1em auto;
        width: 8em;
        border: none;
        border-radius: 3px;
        font-size: 1.2em;
        background: #6aaa64;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
      }
      :host > button svg {
        fill: #ffffff;

      }
      :host > button > span {
        line-height: 2.4em;
      }
      :host > button > io-icon {
        margin-left: 0.5em;
        margin-bottom: -0.5em;
      }
    `;
  }
  static get Properties() {
    return {
      shareText: 'Помозите Речку да удоми Нору и Леу!',
      shareLink: 'https://rechko.com/#puppies=true',
    }
  }
  async onShare() {
    try {
      await navigator.share({
        text: this.shareText + '\n' + this.shareLink
      });
    } catch(err) {
      navigator.clipboard.writeText(this.shareText + '\n' + this.shareLink);
      this.dispatchEvent('message', {message: 'Линк копиран!'});
    }

  }
  changed() {
    this.template([
      ['h3', {class: 'answer'}, this.shareText],
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
      ['div', {class: 'puppies'}, [
        ['img', {src: 'images/nora.jpg'}],
        ['img', {src: 'images/lea.jpg'}],
      ]],
      ['button', {'on-click': this.onShare}, [
        ['span', 'Подели'],
        ['io-icon', {icon: 'buttons:share'}]
      ]],
      ['div', {class: 'rajka'}, [
        ['div', [
          ['p', 'Узраст: 3 месеца'],
          ['p', 'Мајка: Рајка (Епањел бретон)'],
          ['p', 'Рајка нам је дошла уплашена и мршава. Хранили смо је и пазили, и један дан је на свет донела Нору и Леу. Сад им тражимо нови дом. Штенце доносимо на територији Србије (и Босне). А Рајка мајка остаје код нас!'],
          ['p', 'Ако сте заинтересовани позовите на 0638829463'],
          ['a', {href: 'https://www.instagram.com/stories/highlights/17947876616265094/', target: '_blank'}, 'Погледајте више на Инстаграму'],
        ]],
        ['img', {src: 'images/rajka.jpeg'}],
      ]],
    ]);
  }
}

RegisterIoElement(RechkoPuppies);