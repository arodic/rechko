import {RegisterIoElement} from 'io-gui';
import {LetterState} from '../types';
import {RechkoPopup} from './popup';

export class RechkoHelp extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host p {
        font-size: 1.0rem;
        line-height: 1.2em;
        margin: 0.25em 0;
      }
      :host p:last-of-type {
        font-weight: bold;
        border-top: 1px solid #ccc;
        margin-top: 2.5em;
        margin-bottom: 2.5em;
        padding-top: 1.5em;
      }
      :host rechko-board {
        flex: 1 0 auto;
        --tile-size: 64px !important;
        margin-top: 1em;
      }
      @media (max-width: 400px) {
        :host rechko-board {
          --tile-size: 42px !important;
          margin-top: 1em;
          height: 42px;
        }
      }
    `;
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