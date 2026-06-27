import { Register, $ThemeID, div, span, h3 } from '@io-gui/core'
import { ioButton, ioSwitch } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { RechkoPopup, RechkoPopupProps } from './rechko-popup.js'
import { $ShowGDPR, $ColorblindMode } from '../game/state.js'

@Register
export class RechkoPopupSettings extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host io-switch {
        --io_lineHeight: 30px;
        --io_fieldHeight: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--io_borderColor);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--io_borderColor);
      }
      :host .option > span {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host .option > io-switch {
        margin-top: 1em;
        flex-shrink: 0;
      }
      :host .option > io-button {
        --io_spacing: 1em;
        --io_fontSize: 1em;
        --io_fieldHeight: 3.1em;
        flex: 1;
        font-weight: bold;
        justify-content: center;
        border: none;
        margin-top: 2em;
        border-radius: 4px;
      }
    `
  }
  static get Properties(): any {
    return {
      darkTheme: $ThemeID.value === 'dark',
    }
  }
  declare darkTheme: boolean
  showGDPR = () => {
    this.onCloseClicked()
    $ShowGDPR.value = true
  }
  darkThemeChanged() {
    $ThemeID.value = this.darkTheme ? 'dark' : 'light'
  }
  ready() {
    this.mutated()
  }
  mutated() {
    this.render([
      ioIcon({value: 'io:close', '@click': this.onCloseClicked}),
      h3('Подешавања'),
      div({class: 'option'}, [
        span('Тамна тема'),
        ioSwitch({value: this.bind('darkTheme')}),
      ]),
      div({class: 'option'}, [
        span('Боје високог контраста'),
        ioSwitch({value: $ColorblindMode}),
      ]),
      div({class: 'option'}, [
        ioButton({label: 'Подешавање колачића', action: this.showGDPR}),
      ]),
    ])
  }
}

export const rechkoPopupSettings = function(arg0?: RechkoPopupProps) {
  return RechkoPopupSettings.vConstructor(arg0)
}
