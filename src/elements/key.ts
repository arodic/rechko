import { ReactiveElement, ReactiveElementProps, Register, span, button } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'

export type RechkoKeyProps = ReactiveElementProps & {
  key?: string
  state?: string
}

@Register
export class RechkoKey extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        margin: 0 3px 0 0;
        display: flex;
        flex: 1 0 auto;
      }
      :host button {
        font-family: inherit;
        font-weight: bold;
        border: 0;
        height: 58px;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        user-select: none;
        background-color: var(--io_bgColorLight);
        color: var(--io_color);
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
      }
      :host io-icon {
        margin: auto;
        fill: var(--io_color);
      }
      :host[big] {
        flex: 3;
      }
      :host:last-of-type {
        margin: 0;
      }
      :host[state=correct] button,
      :host[state=present] button,
      :host[state=absent] button {
        color: white !important;
      }
      :host[state=correct] button {
        background-color: #6aaa64 !important;
      }
      :host[state=present] button {
        background-color: #c9b458 !important;
      }
      :host[state=absent] button {
        background-color: var(--io_colorLight) !important;
      }
    `
  }
  static get Properties(): any {
    return {
      key: '',
      big: {
        value: false,
        reflect: true,
      },
      state: {
        value: '',
        reflect: true,
      }
    }
  }
  declare key: string
  declare big: boolean
  declare state: string
  onClick() {
    this.dispatch('key', this.key, true)
  }
  keyChanged() {
    this.big = this.key.length > 1
  }
  ready() {
    this.mutated()
  }
  mutated() {
    this.render([button({'@click': this.onClick}, [
      this.key !== 'Backspace' ?
      span(this.key) :
      ioIcon({value: 'buttons:backspace'})
    ])])
  }
}

export const rechkoKey = function(arg0?: RechkoKeyProps) {
  return RechkoKey.vConstructor(arg0)
}
