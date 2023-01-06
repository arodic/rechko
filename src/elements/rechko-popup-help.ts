import { RegisterIoElement } from 'io-gui';
import { LetterState } from '../game/game.js';
import { RechkoPopup } from './rechko-popup.js';

@RegisterIoElement
export class RechkoPopupHelp extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host p {
        font-size: 0.95rem;
        line-height: 1em;
        margin: 0.25em 0;
      }
      :host rechko-board {
        --tile-size: 64px !important;
        margin: 0;
        margin-top: 1em;
      }
      @media (max-width: 400px) {
        :host rechko-board {
          margin-top: 0.5em;
          --tile-size: 42px !important;
          height: 40px;
        }
      }
    `;
  }
  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', '@click': this.onCloseClicked}],
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