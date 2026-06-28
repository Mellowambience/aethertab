# AetherTab — Productivity from the Void

> *"The extension is the distribution layer. The empire is what it opens into."*

AetherTab is a Chrome extension that replaces your new tab with a lore-driven, focused workspace and an optional **MIST Oracle** AI companion.

The current build uses a **Gemini-first bring-your-own-key setup**. No AetherTab-owned API key is bundled in the extension.

## Quick Start (Chrome Dev Mode)

1. Clone or download this repo.
2. Open Chrome → `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** → select this `aethertab/` folder.
5. Open a new tab or click the extension icon.
6. Paste your own Gemini API key into the MIST setup screen.
7. Test the connection, save, and ask the void.

## First-Run Setup

- **AI Provider:** Gemini is the default provider.
- **API key:** Bring your own Gemini API key. It is stored locally with Chrome extension storage.
- **Model:** Defaults to `gemini-1.5-flash-latest`. Change it if your Gemini account uses another supported model.
- **Privacy note:** Do not paste sensitive personal information into free-tier AI providers.

## Security Architecture

| Issue | Common practice | AetherTab |
|---|---|---|
| API key ownership | Developer bundles a key | User brings their own key |
| API key storage | Remote account or hardcoded key | Local Chrome extension storage |
| Host permissions | `<all_urls>` broad | Explicit provider allowlist only |
| AI output rendering | Raw `innerHTML` | `textContent` / DOM node creation |
| OAuth | Hidden token flow | Removed from current BYOK build |
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

## Roadmap

- **v0.2** — Gemini BYOK setup, provider wrapper, minimal permissions
- **v0.3** — Theme gallery, Shard unlock screen, encrypted notes
- **v0.4** — Groq fallback provider, settings polish, screenshots
- **v0.5** — Enterprise consulting CTA, Ko-fi passive drops
- **v1.0** — Chrome Web Store submission

## Release Readiness

See [`docs/web-store-readiness.md`](docs/web-store-readiness.md).

## Agent Workflow

Future agents should read [`AGENTS.md`](AGENTS.md) before editing. Security and Chrome Web Store trust are first-class constraints.

---

*Built by Amara T. — Independent Security Researcher & AI Productivity Builder*  
*Ko-fi: https://ko-fi.com/mellowambience | Hub: https://mellowambience.github.io*

<!-- ✦ Easter egg #1: "The quiet ones build the loudest things." — AetherRose -->
