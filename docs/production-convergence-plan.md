# AetherTab Production Convergence Plan

## Purpose

This document decides which surrounding Aetherhaven projects should merge into, inform, or remain separate from AetherTab.

The goal is a cohesive production product, not a scattered empire map.

## Production North Star

AetherTab is a cozy browser console for focus, AI companionship, tiny break-time games, and local-first security.

Short pitch:

> AetherTab is a magical new-tab workspace with a BYOK AI companion, tiny local games, and privacy-first cartridge security.

## Product Boundary

AetherTab should be the lightweight browser extension.

It should not become:

- a full desktop browser
- a full social world
- a full blockchain product
- a marketplace
- a cloud account platform
- a giant IDE

AetherTab wins by being small, trustworthy, and easy to install.

## Repo Convergence Map

### 1. AetherTab

Role: **Primary product**

Keep as the production MVP:

- Chrome extension
- Home menu
- MIST Oracle BYOK
- HTML6 Arcade
- CartridgeGuard
- Privacy policy
- Chrome Web Store path

AetherTab is the thing to polish and ship first.

### 2. clawd / MIST

Role: **AI companion source-of-truth**

What to borrow:

- MIST identity
- dual-path architecture ideas: cloud + local
- provider strategy: Gemini now, local/Ollama later
- companion tone and continuity model

What not to import yet:

- mobile app complexity
- tRPC server dependency
- cloud account system

Production decision:

AetherTab gets a simplified MIST client. clawd remains the bigger AI companion research repo.

### 3. Ghostline

Role: **security doctrine and future module source**

What to borrow:

- privacy-native security language
- local diagnostic tools
- VaultCheck-style key/storage warnings
- ShadowAudit-style extension checklist
- clear defensive framing

What not to import yet:

- port scanning
- OSINT tooling
- external recon
- anything that looks like surveillance

Production decision:

AetherTab gets `CartridgeGuard` and a local Security Log. Ghostline remains a separate cybersecurity suite.

### 4. AetherProof

Role: **future provenance inspiration**

What to borrow later:

- proof/certificate language
- creator authenticity workflows
- signed cartridge concept
- optional provenance after HTML6 Studio exists

What not to import yet:

- Solana dependency
- wallet flow
- on-chain certificates
- real-time voice/vision backend

Production decision:

No blockchain in AetherTab MVP. Later, use AetherProof ideas for signed cartridges and creator provenance.

### 5. AetherBrowser

Role: **desktop sibling, not merge target**

What to borrow:

- Studio + Arcade mode split
- local project persistence ideas
- publish checklist pattern
- Tauri desktop roadmap language

What not to import into AetherTab:

- Tauri shell
- desktop browser scope
- embedded workspace complexity

Production decision:

AetherTab is the extension. AetherBrowser can become the desktop version later.

### 6. Aetherhaven Hub

Role: **world/lore layer and future community destination**

What to borrow:

- rooms as mental model: Void Lobby, Rose Garden, Forge, Codex Hall
- Void Shards as non-financial achievements
- visual design tokens
- community world language

What not to import yet:

- Supabase realtime
- social presence
- accounts
- multiplayer rooms

Production decision:

Use Aetherhaven Hub as inspiration for labels and future destination links. Do not add social features to AetherTab MVP.

### 7. Aetherhaven Empire Index

Role: **portfolio/strategy index**

What to borrow:

- project taxonomy
- active-workstream overview
- seven-pillar framing
- production prioritization

What not to import into the extension:

- every vertical
- bounty tracking
- unrelated business units

Production decision:

Use this as the external portfolio map. Do not make AetherTab explain the whole empire.

### 8. AetherRose-Scryer

Role: **personal planning/lore inspiration**

What to borrow:

- trajectory/planning ritual flavor
- future timeline card concept
- reflective prompts

What not to import yet:

- heavy personal mythology
- long-term Mars plan language
- anything that confuses the browser-extension pitch

Production decision:

Maybe later: one tiny `Scry` card in Home. Not MVP.

### 9. Codex IDE

Role: **future creator/Studio inspiration**

What to borrow:

- ritual forge energy
- creative coding vibe
- future HTML6 Studio inspiration
- export/session ideas

What not to import yet:

- Monaco editor
- Hydra/Strudel dependencies
- mic/audio permissions
- realtime collaboration

Production decision:

Codex IDE is too large for AetherTab MVP. Mine it later for HTML6 Studio mood and creator tools.

## Recommended Product Architecture

```txt
AetherTab
  Home
    Focus
    MIST Oracle
    HTML6 Arcade
    Security Log
    Settings

  MIST Oracle
    Gemini BYOK now
    Groq optional later
    local/Ollama maybe later via clawd

  HTML6 Arcade
    local cartridges only
    Canvas runtime
    Void Pong
    Shard Catcher
    Rose Runner

  CartridgeGuard
    local validation
    local security events
    no hidden uploads

  Future
    HTML6 Studio
    signed cartridges
    desktop AetherBrowser sibling
```

## What to Build Next

### Immediate quality pass

1. Make Home feel polished.
2. Finish the three built-in arcade games.
3. Make CartridgeGuard real and visible.
4. Add a local Security Log screen.
5. Improve README and privacy policy.
6. Run Chrome dev-mode QA.

### Production MVP

The MVP is production-clear when:

- A stranger understands it in 10 seconds.
- It loads without console errors.
- MIST works with BYOK Gemini.
- HTML6 Arcade has 3 working games.
- Security Log exists.
- No broad Chrome permissions exist.
- README, privacy policy, and QA checklist match reality.

## Things to Avoid

Do not add yet:

- wallets
- blockchain
- remote cartridge sharing
- multiplayer
- Supabase
- Tauri
- Monaco editor
- microphone permissions
- social accounts
- marketplace

## One-Sentence Public Pitch

AetherTab is a magical browser new-tab console for focus, AI companionship, tiny local games, and privacy-first creative tools.

## Portfolio Positioning

AetherTab should become the portfolio anchor because it proves:

- Chrome extension security thinking
- AI provider integration
- local-first UX
- game/runtime design
- product taste
- roadmap discipline

Other projects can be linked as the wider Aetherhaven ecosystem, but AetherTab should remain the clean shippable product.
