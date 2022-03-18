import { IoElement, RegisterIoElement } from '@iogui/iogui';
import { IoThemeSingleton } from '@iogui/iogui/build/elements/core/theme.js';

export * from '@iogui/iogui/build/elements/core/icon.js';
export * from '@iogui/iogui/build/elements/core/button.js';
export * from '@iogui/iogui/build/elements/core/switch.js';

import { getWordOfTheDay, allWords } from './words'
import { LetterState } from './types'
import { history } from './history'

import './elements/board.js';
import './elements/keyboard.js';
import './elements/gdpr.js';
import './elements/help.js';
import './elements/stats.js';
import './elements/settings.js';
import './elements/icons.js';

IoThemeSingleton.theme = JSON.parse(localStorage.getItem('darkTheme') || 'false') ? 'dark' : 'light';

const foolDay = 19083;
const isFool = localStorage.getItem('isFool');

const today = Math.floor((Number(new Date()) + 1000 * 60 * 60 * 1) / (1000 * 60 * 60 * 24));
// Get word of the day
const answer = getWordOfTheDay(today);

// Board state. Each tile is represented as { letter, state }
const board = history.load(today) || Array.from({ length: 6 }, () =>
Array.from({ length: 5 }, () => ({
  letter: '',
  state: LetterState.INITIAL
})));

let allHistory = history.loadAll();

const replaceLatinKeys = [
  ['q','w','e','r','t','y','u','i','o','p','š','đ','ž','a','s','d','f','g','h','j','k','l','č','ć','x','c','v','b','n','m'],
  ['љ','њ','е','р','т','з','у','и','о','п','ш','ђ','ж','а','с','д','ф','г','х','ј','к','л','ч','ћ','џ','ц','в','б','н','м']
];

const replaceEnglishKeys = [
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\','a','s','d','f','g','h','j','k','l',';','\'','x','c','v','b','n','m'],
  ['љ','њ','е','р','т','з','у','и','о','п','ш','ђ','ж','а','с','д','ф','г','х','ј','к','л','ч','ћ','џ','ц','в','б','н','м']
];

export class RechkoApp extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        height: 100%;
        flex-direction: column;
        background: var(--io-background-color);
        color: var(--io-color);
        overflow: hidden;
      }
      :host > header {
        flex: 0 0 auto;
        border-bottom: 1px solid var(--io-color-border);
        position: relative;
      }
      :host > header > h1 {
        margin: 4px 0;
        font-size: 36px;
      }
      :host > header > io-icon {
        position: absolute;
        top: 12px;
        left: 1em;
      }
      :host > header > io-icon.settingsIcon {
        left: auto;
        right: 1em;
      }
      :host > header > io-icon.statsIcon {
        left: auto;
        right: 4em;
      }
      :host > .message {
        position: absolute;
        left: 50%;
        top: 80px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.85);
        padding: 16px 20px;
        z-index: 2;
        border-radius: 4px;
        transform: translateX(-50%);
        transition: opacity 0.3s ease-out;
        font-weight: 600;
      }
      :host > rechko-board {
        flex: 1 1 auto;
      }
      :host[colorblindmode] rechko-board .correct {
        background-color: #f5793a !important;
      }
      :host[colorblindmode] rechko-board .present {
        background-color: #85c0f9 !important;
      }
      :host[colorblindmode] rechko-key[state=correct] button {
        background-color: #f5793a !important;
      }
      :host[colorblindmode] rechko-key[state=present] button {
        background-color: #85c0f9 !important;
      }
      @media (max-width: 310px) {
        :host > header > h1 {
          font-size: 18px;
          line-height: 42px;
          margin-left: -32px;
        }
      }
    `;
  }
  static get Properties() {
    return {
      answer: answer,
      board: board,
      currentRowIndex: board.findIndex((row: any) => row[0].state === 0),
      currentRow: board[board.findIndex((row: any) => row[0].state === 0)],
      shakeRowIndex: -1,
      letterStates: Object,
      allowInput: true,
      message: '',
      showGDPR: JSON.parse(localStorage.getItem('show-gdpr') || 'true'),
      cookiesRequired: JSON.parse(localStorage.getItem('cookiesRequired') || 'true'),
      cookiesImprovement: JSON.parse(localStorage.getItem('cookiesImprovement') || 'true'),
      cookiesAnalitics: JSON.parse(localStorage.getItem('cookiesAnalitics') || 'true'),
      showHelp: false,
      showStats: false,
      showSettings: false,
      hardMode: JSON.parse(localStorage.getItem('hardMode') || 'false'),
      darkTheme: JSON.parse(localStorage.getItem('darkTheme') || 'false'),
      colorblindMode: {
        value: JSON.parse(localStorage.getItem('colorblindMode') || 'false'),
        reflect: 1
      }
    }
  }
  constructor() {
    super();
    this.completeGame();
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keyup', this.onKeyup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keyup', this.onKeyup);
  }
  emitUpdate() {
    this.dispatchEvent('object-mutated', { object: this.board }, false, window);
    this.dispatchEvent('object-mutated', { object: this.letterStates }, false, window);
  }
  onKeyup(event: KeyboardEvent) {
    this.onKey(event.key);
  }
  onKeyboard(event: CustomEvent) {
    this.onKey(event.detail);
  }
  onKey(key: string) {
    if (!this.allowInput) return;
    for (const k in replaceLatinKeys[0]) {
      if (key === replaceLatinKeys[0][k]) {
        key = replaceLatinKeys[1][k]
        continue;
      }
    }
    for (const k in replaceEnglishKeys[0]) {
      if (key === replaceEnglishKeys[0][k]) {
        key = replaceEnglishKeys[1][k]
        continue;
      }
    }
    if (/^[љњертзуиопшђжасдфгхјклчћџцвбнмЉЊЕРТЗУИОПШЂЖАСДФГХЈКЛЧЋЏЦВБНМ]$/.test(key)) {
      this.fillTile(key.toLowerCase())
    } else if (key === 'Backspace') {
      this.clearTile()
    } else if (key === 'Enter') {
      this.completeRow()
    }
  }
  fillTile(letter: string) {
    for (const tile of this.currentRow) {
      if (!tile.letter) {
        tile.letter = letter
        break
      }
    }
    this.emitUpdate();
  }
  clearTile() {
    for (const tile of [...this.currentRow].reverse()) {
      if (tile.letter) {
        tile.letter = ''
        break
      }
    }
    this.emitUpdate();
  }
  completeRow() {
    if (this.currentRow.every((tile: any) => tile.letter)) {
      const guess = this.currentRow.map((tile: any) => tile.letter).join('')
      if (!allWords.includes(guess) && guess !== answer) {
        this.shake();
        this.showMessage(`Реч није на листи`);
        if (this.cookiesImprovement) fetch(`/word_nok/${guess}`);
        return;
      }
      if (this.cookiesImprovement) fetch(`/word_ok/${guess}`);
      this.completeGame();
      this.currentRowIndex += 1;
      if (this.cookiesRequired) {
        history.save(board, today);
        allHistory = history.loadAll();
      }
    } else {
      this.shake();
      this.showMessage('Нема довољно слова')
    }
  }
  completeGame() {
    // Reset state
    this.board.forEach((row: any) => {
      row.forEach((tile: any) => {
        tile.state = LetterState.INITIAL;
      })
    });
    this.board.forEach((row: any) => {
      const answerLetters: (string | null)[] = answer.split('');
      // 1st pass: mark correct ones
      row.forEach((tile: any, i: number) => {
        if (answerLetters[i] === tile.letter || (tile.letter && !isFool && foolDay === today)) {
          localStorage.setItem('isFool', 'true');
          tile.state = this.letterStates[tile.letter] = LetterState.CORRECT;
          answerLetters[i] = null;
        }
      });
      // 2nd pass: mark the present
      row.forEach((tile: any, i: number) => {
        if (!tile.state && answerLetters.includes(tile.letter)) {
          tile.state = LetterState.PRESENT;
          answerLetters[answerLetters.indexOf(tile.letter)] = null;
          if (!this.letterStates[tile.letter]) {
            this.letterStates[tile.letter] = LetterState.PRESENT;
          }
        }
      });
      // 3rd pass: mark absent
      row.forEach((tile: any, i: number) => {
        if (tile.letter && !tile.state) {
          tile.state = LetterState.ABSENT
          if (!this.letterStates[tile.letter]) {
            this.letterStates[tile.letter] = LetterState.ABSENT
          }
        }
      });
    });

    this.allowInput = true;

    this.board.forEach((row: any, i: number) => {
      if (row.every((tile: any) => tile.state === LetterState.CORRECT)) {
        // game win
        this.allowInput = false;
        setTimeout(() => {
          this.showStats = true;
        }, 1600);
        return;
      }
      if (row.every((tile: any) => tile.state !== LetterState.INITIAL)) {
        if (i === 5 && (this.currentRowIndex === 5 || this.currentRowIndex === -1)) {
          // game over
          this.allowInput = false;
          setTimeout(() => {
            this.showStats = true;
          }, 1600);
          return;
        }
      }
    });
    this.emitUpdate();
  }
  onShowGDPR() {
    this.showGDPR = true;
  }
  onHideGDPR() {
    if (!this.cookiesRequired) {
      localStorage.clear();
    }
    localStorage.setItem('cookiesRequired', String(this.cookiesRequired));
    localStorage.setItem('cookiesImprovement', String(this.cookiesImprovement));
    localStorage.setItem('cookiesAnalitics', String(this.cookiesAnalitics));
    localStorage.setItem('show-gdpr', 'false');
    try {
      gtag('consent', 'update', {
        'analytics_storage': this.cookiesAnalitics ? 'granted' : 'denied',
        'ad_storage': this.cookiesAnalitics ? 'granted' : 'denied'
      });
    } catch(error) {
      console.warn(error);
    }
    this.showGDPR = false;
  }
  onShowHelp() {
    this.showHelp = true;
  }
  onHideHelp() {
    this.showHelp = false;
  }
  onShowStats() {
    this.showStats = true;
  }
  onHideStats() {
    this.showStats = false;
  }
  onShowSetttings() {
    this.showSettings = true;
  }
  onHideSettings() {
    this.showSettings = false;
  }
  onMessage(event: CustomEvent) {
    this.showMessage(event.detail.message);
  }
  showMessage(msg: string, time = 1000) {
    this.message = msg
    if (time > 0) {
      setTimeout(() => {
        this.message = ''
      }, time)
    }
  }
  shake() {
    this.shakeRowIndex = this.currentRowIndex;
    setTimeout(() => { this.shakeRowIndex = -1 }, 1000)
  }
  hardModeChanged() {
    if (this.cookiesRequired) localStorage.setItem('hardMode', String(this.hardMode));
  }
  darkThemeChanged() {
    if (this.cookiesRequired) localStorage.setItem('darkTheme', String(this.darkTheme));
    IoThemeSingleton.theme = this.darkTheme ? 'dark' : 'light';
  }
  colorblindModeChanged() {
    if (this.cookiesRequired) localStorage.setItem('colorblindMode', String(this.colorblindMode));
  }
  currentRowIndexChanged() {
    this.currentRow = this.board[Math.min(5, this.currentRowIndex)];
  }
  changed() {
    const modalOpen = this.showGDPR || this.showHelp || this.showStats || this.showSettings;
    this.template([
      ['header', {class: 'header'}, [
        !modalOpen ? ['io-icon', {class:'helpIcon', icon: 'buttons:help', 'on-click': this.onShowHelp}] : null,
        ['h1', 'РЕЧКО'],
        (!modalOpen && this.cookiesRequired) ? ['io-icon', {class:'statsIcon', icon: 'buttons:stats', 'on-click': this.onShowStats}] : null,
        !modalOpen ? ['io-icon', {class:'settingsIcon', icon: 'buttons:settings', 'on-click': this.onShowSetttings}] : null,
      ]],
      ['rechko-board', {class: 'notranslate', board: this.board, shakeRowIndex: this.shakeRowIndex}],
      ['rechko-keyboard', {
        class: 'notranslate',
        letterStates: this.letterStates,
        'on-key': this.onKeyboard
      }],
      this.showGDPR ? ['rechko-gdpr', {
        cookiesRequired: this.bind('cookiesRequired'),
        cookiesImprovement: this.bind('cookiesImprovement'),
        cookiesAnalitics: this.bind('cookiesAnalitics'),
        'on-close': this.onHideGDPR
      }] : null,
      this.showHelp ? ['rechko-help', {'on-close': this.onHideHelp}] : null,
      this.showStats ? ['rechko-stats', {
        'on-close': this.onHideStats,
        'on-message': this.onMessage,
        answer: answer,
        board: this.board,
        history: allHistory
      }] : null,
      this.showSettings ? ['rechko-settings', {
        'on-close': this.onHideSettings,
        'on-show-gdpr': this.onShowGDPR,
        hardMode: this.bind('hardMode'),
        darkTheme: this.bind('darkTheme'),
        colorblindMode: this.bind('colorblindMode'),
      }] : null,
      this.message ? ['div', {class: 'message'}, this.message] : null
    ]);
  }
}

RegisterIoElement(RechkoApp);