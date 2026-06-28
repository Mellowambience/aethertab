// html6/runtime/game-runtime.js — tiny local cartridge runtime

import { InputState } from './input.js';
import { CanvasRenderer } from './renderers/canvas-renderer.js';
import { validateCartridge, CartridgeGuardError } from '../security/cartridge-guard.js';
import { recordSecurityEvent } from '../security/security-events.js';

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
    this.currentCartridge = null;
  }

  async loadCartridge(cartridgePath) {
    this.stop();

    try {
      const cartridge = await this.fetchCartridge(cartridgePath);
      validateCartridge(cartridge);
      this.currentCartridge = cartridge;

      const renderer = new CanvasRenderer({
        mount: this.mount,
        screen: cartridge.screen,
        palette: cartridge.palette || []
      });
      renderer.mountCanvas();
      this.renderer = renderer;

      const moduleUrl = chrome.runtime.getURL(cartridge.entry);
      const module = await import(moduleUrl);
      if (typeof module.createGame !== 'function') {
        throw new Error('Cartridge module does not export createGame(runtime).');
      }

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
    } catch (err) {
      await this.handleLoadError(err, cartridgePath);
      throw err;
    }
  }

  async fetchCartridge(cartridgePath) {
    const response = await fetch(chrome.runtime.getURL(cartridgePath));
    if (!response.ok) throw new Error(`Could not load cartridge: ${cartridgePath}`);
    return response.json();
  }

  async handleLoadError(err, cartridgePath) {
    if (err instanceof CartridgeGuardError) {
      await recordSecurityEvent({
        type: 'cartridge_blocked',
        cartridgePath,
        reason: err.message,
        details: err.details || {}
      });
    }
    this.stop();
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
    this.currentCartridge = null;
  }
}
