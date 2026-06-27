import { ReactiveElement, ReactiveElementProps, Register, Property, WithBinding } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'

export type RechkoPopupProps = ReactiveElementProps & {
  open?: WithBinding<boolean>
}

@Register
export class RechkoPopup extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        flex-direction: column;
        position: absolute;
        padding: 0 2em;
        top: 3.4em;
        opacity: 0;
        bottom: 0;
        left: 0;
        right: 0;
        will-change: transform;
        transform: translate3d(0, 200px, 0);
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        overflow: auto;
        background: var(--io_bgColor);
      }
      :host:not([open]) {
        display: none;
      }
      :host[present] {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      :host h3 {
        font-size: 1.4rem;
      }
      :host p {
        font-size: 1.1rem;
        line-height: 1.2em;
        margin: 0.5em 0;
      }
      :host > io-icon {
        position: absolute;
        cursor: pointer;
        top: 1em;
        right: 1em;
        width: 2.5em;
        height: 2.5em;
      }
    `
  }

  @Property({value: false, reflect: true})
  declare present: boolean

  @Property({value: false, reflect: true})
  declare open: boolean

  openChanged() {
    this.debounce(() => {
      this.present = this.open
    })
  }

  onCloseClicked() {
    this.present = false
    setTimeout(() => {
      this.open = false
    }, 250)
  }

  mutated() {
    this.render([
      ioIcon({value: 'io:close', '@click': this.onCloseClicked}),
    ])
  }
}
