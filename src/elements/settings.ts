import { RegisterIoElement, IoThemeSingleton } from 'io-gui';
import { RechkoPopup } from './popup.js';
import { $ShowGDPR, $HardMode, $ColorblindMode, $ShowSettings } from '../game/state.js';

@RegisterIoElement
export class RechkoSettings extends RechkoPopup {
  static get Style() {
    return /* css */`
      :host io-switch {
        --iotLineHeight: 30px;
        --iotFieldHeight: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--iotBorderColor);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--iotBorderColor);
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
        --iotSpacing: 1em;
        --iotFieldHeight: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background: var(--iotBackgroundColorDimmed);
        border: none;
        margin-top: 0.5em;
        border-radius: 4px;
      }
    `;
  }
  static get Properties() {
    return {
      darkTheme: IoThemeSingleton.theme === 'dark',
    };
  }
  showGDPR = () => {
    this.onCloseClicked();
    $ShowGDPR.value = true;
  };
  darkThemeChanged() {
    IoThemeSingleton.theme = this.darkTheme ? 'dark' : 'light';
  }
  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', '@click': this.onCloseClicked}],
      ['h3', 'Подешавања'],
      ['div', {class: 'option'}, [
        ['span', 'Тамна тема'],
        ['io-switch', {value: this.bind('darkTheme')}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Боје високог контраста'],
        ['io-switch', {value: $ColorblindMode}],
      ]],
      ['div', {class: 'option'}, [
        ['span', 'Тежи режим игре'],
        ['io-switch', {value: $HardMode}],
      ]],
      ['div', {class: 'option'}, [
        ['io-button', {label: 'Подешавање колачића', action: this.showGDPR}],
      ]],

    ]);
  }
}