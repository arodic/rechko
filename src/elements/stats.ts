import {RegisterIoElement} from 'io-gui';
import {LetterState} from '../types.js';
import {RechkoPopup} from './popup.js';

const ICONS = {
  [LetterState.CORRECT]: '🟩',
  [LetterState.PRESENT]: '🟨',
  [LetterState.ABSENT]: '⬜',
  [LetterState.INITIAL]: null
};

@RegisterIoElement
export class RechkoStats extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host h4 {
        margin: 1em 0;
        font-size: 1.2rem;
      }
      :host .board {
        white-space: pre;
        line-height: 1.2em;
      }
      :host .grid {
        margin: 0 auto;
        width: 19em;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }
      :host .grid .count {
        font-size: 2rem;
      }
      :host .distribution > div {
        display: flex;
        margin: 1px 0;
      }
      :host .distribution > div > * {
        padding: 0.25em 0.5em;
      }
      :host .distribution > div > :nth-child(1) {
        width: 1.2em;
      }
      :host .distribution > div:last-of-type > :nth-child(2) {
        background: #ee5a34 !important;
      }
      :host .distribution > div > :nth-child(2) {
        flex: 1;
        background: #6aaa64 !important;
        margin-left: 0.5em;
        text-align: right;
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
      message: '',
      answer: '',
      win: false,
      finish: false,
      boardGrid: '',
      shareText: '',
      board: {
        value: [],
        observe: true
      },
      history: Object,
      gamesStarted: 0,
      gamesFinished: 0,
      gamesWon: 0,
      gameStats: [0, 0, 0, 0, 0, 0, 0]
    };
  }
  historyChanged() {
    let gamesStarted = 0;
    let gamesFinished = 0;
    let gamesWon = 0;
    const gameStats = [0, 0, 0, 0, 0, 0, 0];
    for (const day in this.history) {
      const game = this.history[day];
      if (game[0].every((tile: any) => tile.state !== LetterState.INITIAL)) {
        gamesStarted++;
      }
      game.forEach((row: any, i: number) => {
        if (row.every((tile: any) => tile.state === LetterState.CORRECT)) {
          gameStats[i]++;
          gamesWon++;
          gamesFinished++;
          return;
        }
      });
      if (game[5].every((tile: any) => (tile.state !== LetterState.CORRECT && tile.state !== LetterState.INITIAL))) {
        gamesFinished++;
        gameStats[6]++;
      }
    }
    this.setProperties({
      gamesStarted: gamesStarted,
      gamesFinished: gamesFinished,
      gamesWon: gamesWon,
      gameStats: gameStats,
    });
  }
  async onShare() {
    try {
      await navigator.share({
        text: this.shareText
      });
    } catch(err) {
      void navigator.clipboard.writeText(this.shareText);
      this.dispatchEvent('message', {message: 'Резултат копиран'});
    }

  }
  boardChanged() {
    this.boardMutated();
  }
  boardMutated() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    let lastIndex = -1;
    this.win = false;
    this.finish = false;
    this.board.forEach((row: any) => {
      if (row.every((tile: any) => tile.state !== LetterState.INITIAL)) {
        lastIndex++;
      }
      if (row.every((tile: any) => tile.state === LetterState.CORRECT)) {
        this.win = true;
      }
    });
    if (this.board[5].every((tile: any) => (tile.state !== LetterState.INITIAL))) {
      this.finish = true;
    }

    this.message = this.win ? ['Генијално!', 'Величанствено!', 'Импресивно!', 'Одлично!', 'Браво!', 'Није лоше!'][lastIndex] : this.finish ? this.answer : '';

    this.boardGrid = this.board
      .slice(0, lastIndex + 1)
      .map((row: any) => {
        return row.map((tile: any) => (ICONS as any)[tile.state]).join('');
      })
      .join('\n');
    this.shareText = `rechko.com\n${day}/${month}/${year}\n${this.boardGrid}`;
  }
  changed() {
    const maxGuess = this.gameStats.reduce(function(a: number, b: number) {
      return Math.max(a, b);
    }, -Infinity);

    this.template([
      ['h2', {class: 'answer'}, this.message],
      ['div', {class: 'board'}, this.boardGrid],
      ['h3', 'Статистика'],
      ['div', {class: 'grid'}, [
        ['span', {class: 'count'}, String(this.gamesStarted)],
        ['span', {class: 'count'}, String(this.gamesFinished)],
        ['span', {class: 'count'}, String(this.gamesWon)],
        ['span', 'започетих'],
        ['span', 'одиграних'],
        ['span', 'решених'],
      ]],
      ['h4', 'Дистрибуција погодака:'],
      ['div', {class: 'distribution'}, [
        ['div', [['span', '1'], ['span', {style: {flex: this.gameStats[0] / maxGuess}}, String(this.gameStats[0])]]],
        ['div', [['span', '2'], ['span', {style: {flex: this.gameStats[1] / maxGuess}}, String(this.gameStats[1])]]],
        ['div', [['span', '3'], ['span', {style: {flex: this.gameStats[2] / maxGuess}}, String(this.gameStats[2])]]],
        ['div', [['span', '4'], ['span', {style: {flex: this.gameStats[3] / maxGuess}}, String(this.gameStats[3])]]],
        ['div', [['span', '5'], ['span', {style: {flex: this.gameStats[4] / maxGuess}}, String(this.gameStats[4])]]],
        ['div', [['span', '6'], ['span', {style: {flex: this.gameStats[5] / maxGuess}}, String(this.gameStats[5])]]],
        ['div', [['span', 'x'], ['span', {style: {flex: this.gameStats[6] / maxGuess}}, String(this.gameStats[6])]]],
      ]],
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
      (this.win || this.finish) ? ['button', {'on-click': this.onShare}, [
        ['span', 'Подели'],
        ['io-icon', {icon: 'buttons:share'}]
      ]] : null,
    ]);
  }
}