// html6/security/cartridge-guard.js — defensive local cartridge validation

const MAX_METADATA_BYTES = 8 * 1024;
const ALLOWED_RENDERERS = new Set(['canvas']);
const REQUIRED_FIELDS = ['html6Version', 'id', 'title', 'entry', 'renderer', 'screen'];
const BLOCKED_PROTOCOLS = /^(https?:|javascript:|data:|chrome:|file:)/i;
const SUSPICIOUS_TEXT = /<script|onerror\s*=|onload\s*=|eval\s*\(|new Function|import\s*\(/i;

export class CartridgeGuardError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'CartridgeGuardError';
    this.details = details;
  }
}

export function validateCartridge(cartridge) {
  if (!cartridge || typeof cartridge !== 'object' || Array.isArray(cartridge)) {
    throw new CartridgeGuardError('Cartridge metadata is invalid.');
  }

  const approxBytes = new Blob([JSON.stringify(cartridge)]).size;
  if (approxBytes > MAX_METADATA_BYTES) {
    throw new CartridgeGuardError('Cartridge metadata is too large for the MVP runtime.', { approxBytes });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in cartridge)) {
      throw new CartridgeGuardError(`Cartridge is missing required field: ${field}`);
    }
  }

  validateSafeId(cartridge.id);
  validateSafeText(cartridge.title, 'title');
  validateSafeText(cartridge.author || '', 'author');
  validateSafeText(cartridge.description || '', 'description');
  validateScreen(cartridge.screen);
  validateRenderer(cartridge.renderer);
  validateEntry(cartridge.entry);
  validateControls(cartridge.controls || []);

  return {
    ok: true,
    cartridge
  };
}

function validateSafeId(id) {
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]{1,48}$/i.test(id)) {
    throw new CartridgeGuardError('Cartridge id must be a short slug.');
  }
}

function validateSafeText(value, field) {
  if (typeof value !== 'string') {
    throw new CartridgeGuardError(`Cartridge ${field} must be text.`);
  }
  if (value.length > 280) {
    throw new CartridgeGuardError(`Cartridge ${field} is too long.`);
  }
  if (SUSPICIOUS_TEXT.test(value)) {
    throw new CartridgeGuardError(`Cartridge ${field} contains suspicious script-like text.`);
  }
}

function validateScreen(screen) {
  if (!screen || typeof screen !== 'object') {
    throw new CartridgeGuardError('Cartridge screen settings are invalid.');
  }
  const { width, height, scale } = screen;
  if (!isSafeNumber(width, 64, 640) || !isSafeNumber(height, 64, 480) || !isSafeNumber(scale, 1, 6)) {
    throw new CartridgeGuardError('Cartridge screen dimensions are outside the allowed range.');
  }
}

function validateRenderer(renderer) {
  if (!ALLOWED_RENDERERS.has(renderer)) {
    throw new CartridgeGuardError(`Renderer is not allowed yet: ${renderer}`);
  }
}

function validateEntry(entry) {
  if (typeof entry !== 'string') {
    throw new CartridgeGuardError('Cartridge entry must be a local path.');
  }
  if (BLOCKED_PROTOCOLS.test(entry) || entry.includes('..') || entry.includes('\\')) {
    throw new CartridgeGuardError('Remote or unsafe cartridge entry paths are blocked.');
  }
  if (!entry.startsWith('html6/games/') || !entry.endsWith('.js')) {
    throw new CartridgeGuardError('Cartridge entry must point to a built-in HTML6 game module.');
  }
}

function validateControls(controls) {
  if (!Array.isArray(controls)) {
    throw new CartridgeGuardError('Cartridge controls must be a list.');
  }
  for (const control of controls) {
    validateSafeText(String(control), 'controls');
  }
}

function isSafeNumber(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}
