import { IoElement, RegisterIoElement, Property } from 'io-gui';

@RegisterIoElement
export class RechkoPopup extends IoElement {
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
        /* overflow: auto; */
        background: var(--iotBackgroundColor);
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
    `;
  }

  @Property({value: false, reflect: true})
  declare present: boolean;

  @Property({value: false, reflect: true})
  declare open: boolean;

  openChanged() {
    this.throttle(() => {
      this.present = this.open;
    });
  }

  onCloseClicked() {
    this.present = false;
    this.throttle(() => {
      this.open = false;
    }, undefined, 250);
  }

  changed() {
    this.template([
      ['io-icon', {icon: 'icons:close', '@click': this.onCloseClicked}],
      ['h3', this.title]
    ]);
  }
}