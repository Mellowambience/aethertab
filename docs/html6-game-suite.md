# HTML6 Game Suite — AetherTab Arcade + Studio

## Status

Experimental product direction for AetherTab Phase 3.

## Name

**HTML6** is a product and lore name, not a literal browser standard.

The real implementation should use modern web platform tools:

- HTML Living Standard features
- JavaScript modules
- Canvas 2D
- CSS
- Web Components where useful
- Chrome extension local storage

## One-Line Pitch

HTML6 is a tiny browser-native fantasy console inside AetherTab where users can play, build, and eventually share small break-time games.

## Product Fantasy

AetherTab becomes a small creative console:

> Focus when you need focus. Play when you need a breath. Create when the void whispers.

## Inspirations

### PICO-8

Use the spirit of:

- Small fantasy-console constraints
- Tiny games
- Cartridge-like identity
- Fast play loops
- Strong creative limitations

Do not copy PICO-8 directly.

### GB Studio

Use the spirit of:

- Approachable game creation
- Templates
- Simple exported games
- Friendly constraints

Do not emulate Game Boy hardware or use Nintendo branding.

### PixiJS

Use PixiJS later as an optional renderer for smoother 2D visuals, sprites, particles, texture atlases, filters, and polished arcade menus.

Do not make PixiJS required for the first MVP. The first HTML6 Arcade should run on plain Canvas so it stays tiny, secure, and easy to debug inside a Chrome extension.

## MVP Name Options

- HTML6 Arcade
- HTML6 Studio
- AetherArcade
- VoidCart Studio
- Breakroom Console

Recommended initial menu label:

**HTML6 Arcade**

Recommended later creator label:

**HTML6 Studio**

## MVP Scope

Phase 3 should build only a local arcade first.

MVP includes:

- A menu card/button inside AetherTab
- A game library screen
- A Canvas-based `GameRuntime`
- 3 built-in mini games
- A simple cartridge JSON format
- Start/stop game lifecycle
- Return-to-AetherTab button

MVP does not include:

- Remote game sharing
- Marketplace
- Accounts
- Multiplayer
- User-uploaded JavaScript
- Online cartridge execution
- Monetization
- Full game editor
- PixiJS dependency

## Built-In Starter Games

### 1. Void Pong

A one-screen paddle game.

Core loop:

- Move paddle
- Bounce void orb
- Score points
- Miss and reset

### 2. Shard Catcher

A tiny falling-object game.

Core loop:

- Move basket left/right
- Catch falling Void Shards
- Avoid cursed shards
- Score within 60 seconds

### 3. Rose Runner

A tiny lane-dodge runner.

Core loop:

- Switch lanes
- Avoid thorns
- Collect roses
- Survive as long as possible

## Cartridge Format

A cartridge is a local metadata object that describes a game.

Example:

```json
{
  "html6Version": "0.1",
  "id": "void-pong",
  "title": "Void Pong",
  "author": "AetherTab",
  "description": "Bounce the void orb and keep your focus alive.",
  "renderer": "canvas",
  "screen": {
    "width": 160,
    "height": 144,
    "scale": 3
  },
  "palette": ["#0d0d14", "#7c3aed", "#c4b5fd", "#e8e0f0"],
  "entry": "games/void-pong.js",
  "controls": ["Arrow keys", "Space"]
}
```

Renderer values:

- `canvas` — default for MVP
- `pixi` — later optional renderer after Canvas runtime works

## Suggested File Structure

```txt
html6/
  cartridges/
    void-pong.json
    shard-catcher.json
    rose-runner.json
  runtime/
    game-runtime.js
    input.js
    renderers/
      canvas-renderer.js
      pixi-renderer.js       # later, optional
  games/
    void-pong.js
    shard-catcher.js
    rose-runner.js
  ui/
    arcade-view.js
```

## Runtime Design

The runtime should:

- Create a Canvas element
- Load a local cartridge
- Import the local game module
- Select a renderer from cartridge metadata
- Provide input state
- Run `update(dt)` and `draw(ctx)` loop
- Stop cleanly when leaving the game
- Remove event listeners on exit
- Avoid global state leaks

Suggested game module interface:

```js
export function createGame(runtime) {
  return {
    init() {},
    update(dt) {},
    draw(ctx) {},
    destroy() {}
  };
}
```

## Renderer Strategy

### Phase 3: CanvasRenderer

The first renderer should use plain Canvas 2D.

Use it for:

- Void Pong
- Shard Catcher
- Rose Runner
- Debug overlays
- Simple pixel-art-like drawing

### Phase 3.5: PixiRenderer

Add PixiJS only after the Canvas arcade works.

Use it for:

- Sprite-heavy games
- Particles
- Glow effects
- Cartridge preview animations
- More polished game library transitions
- Higher-end mini-game templates

Important: do not load PixiJS from a remote CDN inside the extension. If PixiJS is added, bundle or vendor it locally and review CSP/security impact.

## Security Rules

- Built-in local games only for MVP.
- Do not execute remote user-submitted JavaScript.
- Do not add broad host permissions.
- Do not add `<all_urls>`.
- Do not add network sharing yet.
- Do not weaken CSP.
- Do not let game modules access AI keys directly.
- Do not use remote CDN scripts for PixiJS.

## Future Studio Mode

After the arcade works, HTML6 Studio can add:

- Template picker
- Sprite grid editor
- Palette editor
- Simple map editor
- Sound effect buttons
- Export cartridge JSON
- Import local cartridge JSON
- Shareable single-file HTML export

## Creator Templates

Possible templates:

- Catcher
- Pong
- Top-down room
- Tiny platformer
- Lane runner
- Dialogue toy
- Pet simulator
- Tarot card flipper

## Sharing Later

Safe sharing path:

1. Export cartridge metadata and assets.
2. Export standalone HTML bundle.
3. Let users share the file themselves.
4. Only later consider an online gallery.

Avoid remote execution inside the extension until there is a strong sandbox design.

## Success Test

HTML6 succeeds if:

- A user opens a new tab.
- Takes a 2-minute break.
- Plays one tiny game.
- Smiles.
- Returns to what they were doing.

The first version should feel like a secret tiny console hidden inside the void.
