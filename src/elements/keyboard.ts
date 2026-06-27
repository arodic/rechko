import { ReactiveElement, ReactiveElementProps, Register, div } from '@io-gui/core'
import { $ColorblindMode } from '../game/state.js'
import { rechkoKey } from './key.js'

export type RechkoKeyboardProps = ReactiveElementProps & {
  letterStates?: Record<string, string>
}

const rows = [
  'љњертзуиопш'.split(''),
  'асдфгхјклчћ'.split(''),
  ['Enter', ...'џцвбнмђж'.split(''), 'Backspace']
]

@Register
export class RechkoKeyboard extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        margin: 1em 1em 1em 1em;
        user-select: none;
      }
      :host > div {
        display: flex;
        width: 100%;
        margin: 0 auto 3px;
        touch-action: manipulation;
      }
      :host[colorblind] rechko-key[state=correct] button {
        background-color: #f5793a !important;
      }
      :host[colorblind] rechko-key[state=present] button {
        background-color: #85c0f9 !important;
      }
      @media (max-width: 360px) {
        :host {
          margin: 0.25em 0.25em 0.25em 0.25em;
        }
      }
    `
  }
  static get Properties(): any {
    return {
      letterStates: {
        type: Object,
        init: null
      },
      colorblind: {
        binding: $ColorblindMode,
        reflect: true
      }
    }
  }
  declare letterStates: Record<string, string>
  declare colorblind: boolean
  letterStatesMutated() {
    this.mutated()
  }
  ready() {
    this.mutated()
  }
  mutated() {
    this.render(rows.map(row => {
      return div(row.map(key => {
        return rechkoKey({key: key, state: this.letterStates[key] || ''})
      }))
    }))
  }
}

export const rechkoKeyboard = function(arg0?: RechkoKeyboardProps) {
  return RechkoKeyboard.vConstructor(arg0)
}
