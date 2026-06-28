// html6/runtime/renderers/canvas-renderer.js — default HTML6 renderer

export class CanvasRenderer {
  constructor({ mount, screen, palette }) {
    this.mount = mount;
    this.screen = screen;
    this.palette = palette;
    this.canvas = document.createElement('canvas');
    this.canvas.width = screen.width;
    this.canvas.height = screen.height;
    this.canvas.style.width = `${screen.width * screen.scale}px`;
    this.canvas.style.height = `${screen.height * screen.scale}px`;
    this.canvas.style.maxWidth = '100%';
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.border = '1px solid #2d1f4e';
    this.canvas.style.borderRadius = '10px';
    this.canvas.style.background = palette[0] || '#0d0d14';
    this.ctx = this.canvas.getContext('2d');
  }

  mountCanvas() {
    this.mount.replaceChildren(this.canvas);
    return this.canvas;
  }

  clear() {
    this.ctx.fillStyle = this.palette[0] || '#0d0d14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.canvas.remove();
  }
}
