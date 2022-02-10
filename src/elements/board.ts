import {IoElement, RegisterIoElement} from '@iogui/iogui';

export class RechkoBoard extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: grid;
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 5px;
        padding: 5px;
        box-sizing: border-box;
        --height: min(420px, calc(var(--vh, 100vh) - 310px));
        /* height: var(--height); */
        width: min(350px, calc(var(--height) / 6 * 5));
        margin: 0px auto;
      }
      :host .correct,
      :host .present,
      :host .absent {
        color: var(--io-color) !important;
      }
      :host .correct {
        background-color: #6aaa64 !important;
      }
      :host .present {
        background-color: #c9b458 !important;
      }
      :host .absent {
        background-color: var(--io-background-color-dark) !important;
      }
      :host .row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
      }
      :host .tile {
        height: min(65px, calc(calc(var(--height) / 6)) - 5px);
        width: 100%;
        font-size: 2rem;
        line-height: 2rem;
        font-weight: bold;
        vertical-align: middle;
        text-transform: uppercase;
        user-select: none;
        position: relative;
      }
      :host .tile.filled {
        animation: zoom 0.2s;
      }
      :host .tile .front,
      :host .tile .back {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      :host .tile .front {
        border: 1px solid var(--io-color-border);
      }
      :host .tile.filled .front {
        background: var(--io-background-color-light);
      }
      :host .tile .back {
        transform: rotateX(180deg);
      }
      :host .tile.revealed .front {
        transform: rotateX(180deg);
      }
      :host .tile.revealed .back {
        transform: rotateX(0deg);
      }
      @keyframes zoom {
        0% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      :host .shake {
        animation: shake 0.5s;
      }
      @keyframes shake {
        0% {
          transform: translate(1px);
        }
        10% {
          transform: translate(-3px);
        }
        20% {
          transform: translate(3px);
        }
        30% {
          transform: translate(-3px);
        }
        40% {
          transform: translate(3px);
        }
        50% {
          transform: translate(-3px);
        }
        60% {
          transform: translate(3px);
        }
        70% {
          transform: translate(-3px);
        }
        80% {
          transform: translate(3px);
        }
        90% {
          transform: translate(-3px);
        }
        100% {
          transform: translate(1px);
        }
      }
      @media (max-height: 680px) {
        :host .tile {
          font-size: 3vh;
        }
      }
    `;
  }
  static get Properties() {
    return {
      board: {
        value: [],
        observe: true,
      },
      shakeRowIndex: -1,
      translate: {
        value: "no",
        reflect: 1
      }
    }
  }
  changed() {
    this.template(this.board.map((row: any, i: number) => {
      return ['div', {class: `row ${ this.shakeRowIndex === i && 'shake'}`}, row.map((tile: any, j: number) =>{
        return ['div', {class: `tile ${tile.letter && 'filled'} ${tile.state && 'revealed'}`}, [
          ['div', {class: 'front', style: {'transition-delay': `${j * 300}ms`}}, tile.letter],
          ['div', {class: `back ${tile.state}`, style: {'transition-delay': `${j * 300}ms`}}, tile.letter],
        ]]
      })]
    }));
  }
}

RegisterIoElement(RechkoBoard);