import { RegisterIoElement, IoThemeSingleton, LIGHT_THEME, DARK_THEME, Color } from 'io-gui';
import { RechkoPopup } from './rechko-popup.js';
import { $ShowGDPR, $HardMode, $ColorblindMode } from '../game/state.js';

DARK_THEME.iotBackgroundColorFaint = new Color(0.3, 0.3, 0.3, 1);
DARK_THEME.iotBackgroundColorStrong = new Color(0.15, 0.15, 0.15, 1);

IoThemeSingleton.registerTheme('light', LIGHT_THEME);
IoThemeSingleton.registerTheme('dark', DARK_THEME);
IoThemeSingleton.themeIDChanged();
IoThemeSingleton.changed();

@RegisterIoElement
export class RechkoPopupSettings extends RechkoPopup {
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
        --iotFontSize: 1em;
        --iotFieldHeight: 3.1em;
        flex: 1;  
        font-weight: bold;
        justify-content: center;
        border: none;
        margin-top: 2em;
        border-radius: 4px;
      }
    `;
  }
  static get Properties() {
    return {
      darkTheme: IoThemeSingleton.themeID === 'dark',
    };
  }
  showGDPR = () => {
    this.onCloseClicked();
    $ShowGDPR.value = true;
  };
  darkThemeChanged() {
    IoThemeSingleton.themeID = this.darkTheme ? 'dark' : 'light';
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