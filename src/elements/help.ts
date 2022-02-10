import {IoElement, RegisterIoElement} from '@iogui/iogui';
import { LetterState } from '../types'

export class RechkoHelp extends IoElement {
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
        font-size: 1.0rem;
        line-height: 1.2em;
        margin: 0.25em 0;
      }
      :host p:last-of-type {
        font-weight: bold;
        border-top: 1px solid #ccc;
        margin-top: 1.5em;
        padding-top: 1.5em;
      }
      :host io-icon {
        position: absolute;
        top: 1em;
        right: 1em;
      }
      :host rechko-board {
        grid-template-rows: repeat(1, 1fr);
        margin-top: 1em;
        --height: min(340px, calc(var(--vh, 100vh) - 310px));
      }
    `;
  }
  onClose() {
    this.dispatchEvent('close');
  }
  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
      ['h2', 'Правила игре'],
      ['p', 'Погодите задату реч у 6 покушаја.'],
      ['p', 'Сваки покушај мора бити постојећа реч.'],
      ['p', 'Притисните ENTER да унесете реч.'],
      ['p', 'Погођена слова биће обележена бојама.'],
      ['h2', 'Примери:'],
      ['rechko-board', {class: 'notranslate', board: [[
        {letter: 'с', state: 0},
        {letter: 'л', state: LetterState.CORRECT},
        {letter: 'о', state: 0},
        {letter: 'г', state: 0},
        {letter: 'а', state: 0},
      ]]}],
      ['p', 'Слово Л је погођено на тачном месту.'],      
      ['rechko-board', {class: 'notranslate', board: [[
        {letter: 'н', state: 0},
        {letter: 'а', state: 0},
        {letter: 'м', state: 0},
        {letter: 'а', state: 0},
        {letter: 'з', state: LetterState.PRESENT},
      ]]}],
      ['p', 'Слово З је погођено али на погрешном месту.'],
      ['rechko-board', {class: 'notranslate', board: [[
        {letter: 'д', state: 0},
        {letter: 'о', state: LetterState.ABSENT},
        {letter: 'д', state: 0},
        {letter: 'и', state: 0},
        {letter: 'р', state: 0},
      ]]}],
      ['p', 'Слово О не постоји у задатој речи.'],
      ['p', 'Задата реч се мења сваког дана.'],
    ]);
  }
}

RegisterIoElement(RechkoHelp);