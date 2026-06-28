# AetherTab — Productivity from the Void

> *"The extension is the distribution layer. The empire is what it opens into."*

AetherTab is a magical new-tab workspace with a Gemini BYOK AI companion, a local HTML6 mini-game arcade, and privacy-first cartridge security.

The current build uses a **Gemini-first bring-your-own-key setup**. No AetherTab-owned API key is bundled in the extension.

## Quick Start (Chrome Dev Mode)

1. Clone or download this repo.
2. Open Chrome → `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** → select this `aethertab/` folder.
5. Open a new tab or click the extension icon.
6. Use the AetherTab Home menu to open MIST Oracle, HTML6 Arcade, Security Log, or Settings.
7. For MIST, paste your own Gemini API key in Settings.
8. For HTML6 Arcade, launch **Void Pong**, **Shard Catcher**, or **Rose Runner** from the arcade screen.

## Current Product Areas

- **AetherTab Home:** Main navigation for the suite.
- **MIST Oracle:** Optional BYOK Gemini assistant.
- **HTML6 Arcade:** Local break-time mini-game suite.
- **Security Log:** Local CartridgeGuard events. Nothing uploads automatically.
- **Settings:** Gemini provider configuration and local data controls.

## First-Run Setup

- **AI Provider:** Gemini is the default provider.
- **API key:** Bring your own Gemini API key. It is stored locally with Chrome extension storage.
- **Model:** Defaults to `gemini-1.5-flash-latest`. Change it if your Gemini account uses another supported model.
- **Privacy note:** Do not paste sensitive personal information into free-tier AI providers.
- **Arcade:** HTML6 Arcade does not require an AI key for built-in local games.

## HTML6 Arcade MVP

HTML6 is a product/lore name, not a literal new browser standard.

Current arcade milestone:

- Local Canvas-based runtime
- Local cartridge metadata
- Built-in **Void Pong** cartridge
- Built-in **Shard Catcher** cartridge
- Built-in **Rose Runner** cartridge
- Start/stop lifecycle
- Back-to-home flow
- No remote cartridges
- No marketplace
- No extra permissions

HTML6 docs live in [`docs/html6-game-suite.md`](docs/html6-game-suite.md).

## Security Architecture

| Issue | Common practice | AetherTab |
|---|---|---|
| API key ownership | Developer bundles a key | User brings their own key |
| API key storage | Remote account or hardcoded key | Local Chrome extension storage |
| Host permissions | `<all_urls>` broad | Explicit provider allowlist only |
| AI output rendering | Raw `innerHTML` | `textContent` / DOM node creation |
| OAuth | Hidden token flow | Removed from current BYOK build |
| Arcade code | Remote game scripts | Built-in local cartridges only |
| Cartridge safety | Blindly load game metadata | CartridgeGuard validates before loading |
| Security reporting | Hidden telemetry | Local user-visible Security Log |
| Analytics / telemetry | Often embedded | None by default |

## Current Permissions

```json
"permissions": ["storage"],
"host_permissions": [
  "https://generativelanguage.googleapis.com/*"
]
```

No `<all_urls>`. No `identity`. No `tabs`. No `webRequest`. No telemetry.

## AI Provider Strategy

Default provider:

- Gemini

Planned fallback provider:

- Groq

Possible advanced option later:

- OpenRouter

Provider docs live in [`docs/ai-provider-strategy.md`](docs/ai-provider-strategy.md).

## Production Convergence

See [`docs/production-convergence-plan.md`](docs/production-convergence-plan.md).

## Privacy

See [`docs/privacy-policy-draft.md`](docs/privacy-policy-draft.md).

## Roadmap

- **v0.2** — Gemini BYOK setup, provider wrapper, minimal permissions
- **v0.3** — AetherTab Home, HTML6 Arcade MVP, three built-in games
- **v0.4** — CartridgeGuard, local Security Log, QA polish
- **v0.5** — Groq fallback provider, PixiJS renderer experiment, screenshots
- **v1.0** — Chrome Web Store submission

## Release Readiness

See [`docs/web-store-readiness.md`](docs/web-store-readiness.md).

## Agent Workflow

Future agents should read [`AGENTS.md`](AGENTS.md) before editing. Security and Chrome Web Store trust are first-class constraints.

---

*Built by Amara T. — Independent Security Researcher & AI Productivity Builder*  
*Ko-fi: https://ko-fi.com/mellowambience | Hub: https://mellowambience.github.io*

<!-- ✦ Easter egg #1: "The quiet ones build the loudest things." — AetherRose -->
