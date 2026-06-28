// html6/runtime/input.js — tiny keyboard input state

export class InputState {
  constructor(target = window) {
    this.target = target;
    this.keys = new Set();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  start() {
    this.target.addEventListener('keydown', this.handleKeyDown);
    this.target.addEventListener('keyup', this.handleKeyUp);
  }

  stop() {
    this.target.removeEventListener('keydown', this.handleKeyDown);
    this.target.removeEventListener('keyup', this.handleKeyUp);
    this.keys.clear();
  }

  handleKeyDown(event) {
    this.keys.add(event.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    this.keys.delete(event.code);
  }

  isDown(...codes) {
    return codes.some((code) => this.keys.has(code));
  }
}
