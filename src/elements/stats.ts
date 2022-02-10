import {IoElement, RegisterIoElement} from '@iogui/iogui';
import { transpile } from 'typescript';
import { LetterState } from '../types'

export class RechkoStats extends IoElement {
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
        margin: 1em 0;
        font-size: 1.4rem;
      }
      :host h4 {
        margin: 1em 0;
        font-size: 1.2rem;
      }
      :host .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }
      :host .grid .count {
        font-size: 3rem;
      }
      :host .distribution > div {
        display: flex;
        margin: 1px 0;
      }
      :host .distribution > div > * {
        padding: 0.25em 0.5em;
      }
      :host .distribution > div > :nth-child(2) {
        flex: 1;
        background: var(--io-color-gradient-end);
        margin-left: 0.5em;
        text-align: right;
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
      history: Object,
      gamesStarted: 0,
      gamesFinished: 0,
      gamesWon: 0,
      gameStats: [0, 0, 0, 0, 0, 0]
    }
  }
  onClose() {
    this.dispatchEvent('close');
  }
  historyChanged() {
    let gamesStarted = 0;
    let gamesFinished = 0;
    let gamesWon = 0;
    let gameStats = [0, 0, 0, 0, 0, 0];
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
      }
    }
    this.setProperties({
      gamesStarted: gamesStarted,
      gamesFinished: gamesFinished,
      gamesWon: gamesWon,
      gameStats: gameStats,
    })
  }
  changed() {
    const maxGuess = this.gameStats.reduce(function(a: number, b: number) {
      return Math.max(a, b);
    }, -Infinity);

    this.template([
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
        ['div', [
          ['span', '1'], ['span', {style: {flex: this.gameStats[0] / maxGuess}}, String(this.gameStats[0])]
        ]],
        ['div', [
          ['span', '2'], ['span', {style: {flex: this.gameStats[1] / maxGuess}}, String(this.gameStats[1])]
        ]],
        ['div', [
          ['span', '3'], ['span', {style: {flex: this.gameStats[2] / maxGuess}}, String(this.gameStats[2])]
        ]],
        ['div', [
          ['span', '4'], ['span', {style: {flex: this.gameStats[3] / maxGuess}}, String(this.gameStats[3])]
        ]],
        ['div', [
          ['span', '5'], ['span', {style: {flex: this.gameStats[4] / maxGuess}}, String(this.gameStats[4])]
        ]],
        ['div', [
          ['span', '6'], ['span', {style: {flex: this.gameStats[5] / maxGuess}}, String(this.gameStats[5])]
        ]],
      ]],
      ['io-icon', {icon: 'icons:close', 'on-click': this.onClose}],
    ]);
  }
}

RegisterIoElement(RechkoStats);