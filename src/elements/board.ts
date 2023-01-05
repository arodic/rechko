import {IoElement, RegisterIoElement} from 'io-gui';
import { $ColorblindMode } from '../game/state.js';

@RegisterIoElement
export class RechkoBoard extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: block;
        overflow: hidden;
        padding: 5px;
        margin: 1em 1em 1em 1em;
        box-sizing: border-box;
      }
      :host .correct,
      :host .present,
      :host .absent {
        color: white;
      }
      :host .correct {
        background-color: #6aaa64 !important;
      }
      :host .present {
        background-color: #c9b458 !important;
      }
      :host .absent {
        background-color: var(--iotBackgroundColorStrong) !important;
      }
      :host .row {
        display: flex;
        width: calc(var(--tile-size) * 5);
        height: var(--tile-size);
        margin: 0 auto;
      }
      :host .tile {
        height: calc(var(--tile-size) - 6px);
        width: calc(var(--tile-size) - 6px);
        margin-right: 5px;
        font-size: 3rem;
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
        border: 1px solid var(--iotBorderColor);
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
      :host[colorblind] .correct {
        background-color: #f5793a !important;
      }
      :host[colorblind] .present {
        background-color: #85c0f9 !important;
      }
      :host[colorblind] rechko-key[state=correct] button {
        background-color: #f5793a !important;
      }
      :host[colorblind] rechko-key[state=present] button {
        background-color: #85c0f9 !important;
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
      @media (max-width: 400px) {
        :host {
          padding: 1px;
        }
        :host .row {
          width: calc(var(--tile-size) * 5);
          height: var(--tile-size);
        }
        :host .tile {
          font-size: 2rem;
          margin-right: 1px;
          height: calc(var(--tile-size) - 2px);
          width: calc(var(--tile-size) - 1.2px);
        }
      }
    `;
  }
  static get Properties(): any {
    return {
      board: {
        value: [],
        observe: true,
      },
      shakeRowIndex: -1,
      translate: {
        value: 'no',
        reflect: true
      },
      colorblind: {
        binding: $ColorblindMode,
        reflect: true
      }
    };
  }
  onResized() {
    const rect = this.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height*5/6) / 5;
    this.style.setProperty('--tile-size', size + 'px');
  }
  changed() {
    this.template(this.board.map((row: any, i: number) => {
      return ['div', {class: `row ${ this.shakeRowIndex === i && 'shake'}`}, row.map((tile: any, j: number) =>{
        return ['div', {class: `tile ${tile.letter && 'filled'} ${tile.state && 'revealed'}`}, [
          ['div', {class: 'front', style: {'transiti@delay': `${j * 300}ms`}}, tile.letter],
          ['div', {class: `back ${tile.state}`, style: {'transiti@delay': `${j * 300}ms`}}, tile.letter],
        ]];
      })];
    }));
  }
}