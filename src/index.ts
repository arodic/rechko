import { ReactiveElement, Register, div, header, h1 } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'

import { $CookiesImprovement, $CookiesRequired, $ShowGDPR, $ShowHelp, $ShowSettings, $ShowStats } from './game/state.js'

import { getWordOfTheDay, allWords } from './game/words.js'
import { gameHistory, LetterState } from './game/game.js'

import './elements/icons.js'
import { rechkoBoard } from './elements/board.js'
import { rechkoKeyboard } from './elements/keyboard.js'
import { rechkoPopupGdpr } from './elements/rechko-popup-gdpr.js'
import { rechkoPopupHelp } from './elements/rechko-popup-help.js'
import { rechkoPopupSettings } from './elements/rechko-popup-settings.js'
import { rechkoPopupStats } from './elements/rechko-popup-stats.js'

const today = Math.floor((Number(new Date()) + 1000 * 60 * 60 * 2) / (1000 * 60 * 60 * 24))
// Get word of the day
const answer = getWordOfTheDay(today - 242)
// Board state. Each tile is represented as { letter, state }
const board = gameHistory.load(today) || Array.from({ length: 6 }, () =>
  Array.from({ length: 5 }, () => ({
    letter: '',
    state: LetterState.INITIAL
  })))

let allHistory = gameHistory.loadAll()

const replaceLatinKeys = [
  ['q','w','e','r','t','y','u','i','o','p','š','đ','ž','a','s','d','f','g','h','j','k','l','č','ć','x','c','v','b','n','m'],
  ['љ','њ','е','р','т','з','у','и','о','п','ш','ђ','ж','а','с','д','ф','г','х','ј','к','л','ч','ћ','џ','ц','в','б','н','м']
]

const replaceEnglishKeys = [
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\','a','s','d','f','g','h','j','k','l',';','\'','x','c','v','b','n','m'],
  ['љ','њ','е','р','т','з','у','и','о','п','ш','ђ','ж','а','с','д','ф','г','х','ј','к','л','ч','ћ','џ','ц','в','б','н','м']
]


@Register
export class RechkoApp extends ReactiveElement {
  static get Style(): any {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        height: 100%;
        flex-direction: column;
        background: var(--io_bgColor);
        color: var(--io_color);
        overflow: hidden;
      }
      :host > header {
        flex: 0 0 auto;
        border-bottom: 1px solid var(--io_borderColor);
        position: relative;
      }
      :host > header > h1 {
        margin: 4px 0;
        font-size: 36px;
      }
      :host > .icons > io-icon {
        display: block;
        position: absolute;
        top: 12px;
        width: 1.8em;
        height: 1.8em;
        cursor: pointer;
      }
      :host > .icons > io-icon.helpIcon {
        left: 1em;
      }
      :host > .icons > io-icon.settingsIcon {
        left: auto;
        right: 1em;
      }
      :host > .icons > io-icon.statsIcon {
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
      @media (max-width: 310px) {
        :host > header > h1 {
          font-size: 18px;
          line-height: 42px;
          margin-left: -32px;
        }
      }
    `
  }
  static get Properties(): any {
    return {
      answer: answer,
      board: board,
      currentRowIndex: board.findIndex((row: any) => row[0].state === 0),
      currentRow: board[board.findIndex((row: any) => row[0].state === 0)],
      shakeRowIndex: -1,
      letterStates: {type: Object, init: null},
      allowInput: true,
      message: '',
      showGDPR: $ShowGDPR,
      showHelp: $ShowHelp,
      showStats: $ShowStats,
      showSettings: $ShowSettings,
    }
  }
  declare answer: string
  declare board: any[][]
  declare currentRowIndex: number
  declare currentRow: any[]
  declare shakeRowIndex: number
  declare letterStates: Record<string, string>
  declare allowInput: boolean
  declare message: string
  declare showGDPR: boolean
  declare showHelp: boolean
  declare showStats: boolean
  declare showSettings: boolean
  ready() {
    this.completeGame()
    this.mutated()
  }
  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('keyup', this.onKeyup)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('keyup', this.onKeyup)
  }
  emitUpdate() {
    this.dispatchMutation(this.board)
    this.dispatchMutation(this.letterStates)
  }
  onKeyup(event: KeyboardEvent) {
    this.onKey(event.key)
  }
  onKeyboard(event: CustomEvent) {
    this.onKey(event.detail)
  }
  onHelp() {
    $ShowHelp.value = true
  }
  onStats() {
    $ShowStats.value = true
  }
  onSettings() {
    $ShowSettings.value = true
  }
  onKey(key: string) {
    if (!this.allowInput) return
    for (const k in replaceLatinKeys[0]) {
      if (key === replaceLatinKeys[0][k]) {
        key = replaceLatinKeys[1][k]
        continue
      }
    }
    for (const k in replaceEnglishKeys[0]) {
      if (key === replaceEnglishKeys[0][k]) {
        key = replaceEnglishKeys[1][k]
        continue
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
    this.emitUpdate()
  }
  clearTile() {
    for (const tile of [...this.currentRow].reverse()) {
      if (tile.letter) {
        tile.letter = ''
        break
      }
    }
    this.emitUpdate()
  }
  completeRow() {
    if (this.currentRow.every((tile: any) => tile.letter)) {
      const guess = this.currentRow.map((tile: any) => tile.letter).join('')
      if (!allWords.includes(guess) && guess !== answer) {
        this.shake()
        this.showMessage('Реч није на листи')
        if ($CookiesImprovement.value) void fetch(`https://analytics.rechko.com/word_nok/${guess}`)
        return
      }
      if ($CookiesImprovement.value) void fetch(`https://analytics.rechko.com/word_ok/${guess}`)
      this.completeGame()
      this.currentRowIndex += 1
      if ($CookiesRequired.value) {
        gameHistory.save(board, today)
        allHistory = gameHistory.loadAll()
      }
    } else {
      this.shake()
      this.showMessage('Нема довољно слова')
    }
  }
  completeGame() {
    // Reset state
    this.board.forEach((row: any) => {
      row.forEach((tile: any) => {
        tile.state = LetterState.INITIAL
      })
    })
    this.board.forEach((row: any) => {
      const answerLetters: (string | null)[] = answer.split('')
      // 1st pass: mark correct ones
      row.forEach((tile: any, i: number) => {
        if (answerLetters[i] === tile.letter) {
          tile.state = this.letterStates[tile.letter] = LetterState.CORRECT
          answerLetters[i] = null
        }
      })
      // 2nd pass: mark the present
      row.forEach((tile: any) => {
        if (!tile.state && answerLetters.includes(tile.letter)) {
          tile.state = LetterState.PRESENT
          answerLetters[answerLetters.indexOf(tile.letter)] = null
          if (!this.letterStates[tile.letter]) {
            this.letterStates[tile.letter] = LetterState.PRESENT
          }
        }
      })
      // 3rd pass: mark absent
      row.forEach((tile: any) => {
        if (tile.letter && !tile.state) {
          tile.state = LetterState.ABSENT
          if (!this.letterStates[tile.letter]) {
            this.letterStates[tile.letter] = LetterState.ABSENT
          }
        }
      })
    })

    this.allowInput = true

    this.board.forEach((row: any, i: number) => {
      if (row.every((tile: any) => tile.state === LetterState.CORRECT)) {
        // game win
        this.allowInput = false
        setTimeout(() => {
          $ShowStats.value = true
        }, 500)
        return
      }
      if (row.every((tile: any) => tile.state !== LetterState.INITIAL)) {
        if (i === 5 && (this.currentRowIndex === 5 || this.currentRowIndex === -1)) {
          // game over
          this.allowInput = false
          setTimeout(() => {
            $ShowStats.value = true
          }, 500)
          return
        }
      }
    })
    this.emitUpdate()
  }
  onMessage(event: CustomEvent) {
    this.showMessage(event.detail.message)
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
    this.shakeRowIndex = this.currentRowIndex
    setTimeout(() => { this.shakeRowIndex = -1 }, 1000)
  }
  currentRowIndexChanged() {
    this.currentRow = this.board[Math.min(5, this.currentRowIndex)]
  }
  mutated() {
    const popupOpen = $ShowGDPR.value || $ShowHelp.value || $ShowStats.value || $ShowSettings.value
    this.render([
      header({class: 'header'}, [h1('РЕЧКО')]),
      rechkoBoard({class: 'notranslate', board: this.board, shakeRowIndex: this.shakeRowIndex}),
      rechkoKeyboard({
        class: 'notranslate',
        letterStates: this.letterStates,
        '@key': this.onKeyboard
      }),
      !popupOpen ? div({class: 'icons'}, [
        ioIcon({class: 'helpIcon', value: 'buttons:help', '@click': this.onHelp}),
        ioIcon({class: 'statsIcon', value: 'buttons:stats', '@click': this.onStats}),
        ioIcon({class: 'settingsIcon', value: 'buttons:settings', '@click': this.onSettings}),
      ]) : null,
      rechkoPopupGdpr({open: $ShowGDPR}),
      rechkoPopupHelp({open: $ShowHelp}),
      rechkoPopupSettings({open: $ShowSettings}),
      rechkoPopupStats({
        '@message': this.onMessage,
        open: $ShowStats,
        answer: answer,
        board: this.board,
        history: allHistory
      }),
      this.message ? div({class: 'message'}, this.message) : null,
    ])
  }
}
