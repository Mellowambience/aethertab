// html6/runtime/game-runtime.js — tiny local cartridge runtime

import { InputState } from './input.js';
import { CanvasRenderer } from './renderers/canvas-renderer.js';

const ALLOWED_RENDERERS = new Set(['canvas']);

export class GameRuntime {
  constructor({ mount, statusEl }) {
    this.mount = mount;
    this.statusEl = statusEl;
    this.input = new InputState(window);
    this.renderer = null;
    this.game = null;
    this.animationFrame = null;
    this.lastTime = 0;
    this.running = false;
  }

  async loadCartridge(cartridgePath) {
    this.stop();
    const cartridge = await this.fetchCartridge(cartridgePath);
    this.validateCartridge(cartridge);

    const renderer = new CanvasRenderer({
      mount: this.mount,
      screen: cartridge.screen,
      palette: cartridge.palette || []
    });
    renderer.mountCanvas();
    this.renderer = renderer;

    const module = await import(chrome.runtime.getURL(cartridge.entry));
    this.game = module.createGame({
      cartridge,
      input: this.input,
      renderer,
      screen: cartridge.screen,
      palette: cartridge.palette || []
    });

    if (this.statusEl) {
      this.statusEl.textContent = `${cartridge.title} loaded — ${cartridge.controls?.join(', ') || 'keyboard'}`;
    }

    this.game.init?.();
    this.input.start();
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame((time) => this.loop(time));
  }

  async fetchCartridge(cartridgePath) {
    const response = await fetch(chrome.runtime.getURL(cartridgePath));
    if (!response.ok) throw new Error(`Could not load cartridge: ${cartridgePath}`);
    return response.json();
  }

  validateCartridge(cartridge) {
    if (!cartridge || typeof cartridge !== 'object') throw new Error('Invalid cartridge.');
    if (!cartridge.id || !cartridge.title || !cartridge.entry) throw new Error('Cartridge is missing required fields.');
    if (!ALLOWED_RENDERERS.has(cartridge.renderer)) throw new Error(`Renderer not allowed yet: ${cartridge.renderer}`);
    if (/^(https?:|javascript:|data:|chrome:|file:)/i.test(cartridge.entry)) {
      throw new Error('Remote or unsafe cartridge entry paths are blocked.');
    }
    if (!cartridge.entry.startsWith('html6/games/')) {
      throw new Error('Cartridge entry must point to a built-in HTML6 game module.');
    }
  }

  loop(time) {
    if (!this.running || !this.game || !this.renderer) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.game.update?.(dt);
    this.renderer.clear();
    this.game.draw?.(this.renderer.ctx);

    this.animationFrame = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  stop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    this.running = false;
    this.input.stop();
    this.game?.destroy?.();
    this.game = null;
    this.renderer?.destroy?.();
    this.renderer = null;
  }
}
