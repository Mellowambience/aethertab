# AetherTab — Productivity from the Void

> *"The extension is the distribution layer. The empire is what it opens into."*

A Chrome extension that replaces your new tab with a lore-driven, focused workspace. Aetherhaven universe. Encrypted AI sidebar. Void Shards cosmetic progression. Zero `<all_urls>` permissions.

## Quick Start (Chrome Dev Mode)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select this `aethertab/` folder
4. Open a new tab — you're in the void

## First-Run Setup

- **Weather:** In ⚙ Settings → enter your [OpenWeatherMap API key](https://openweathermap.org/api) (free)
- **AI Sidebar:** Click `⟐` (top-right) → drop in your Gemini/OpenAI/Groq key + set vault passphrase
- **MIST Oracle:** In ⚙ Settings → enter your MIST Railway endpoint to use your own agent brain

## Security Architecture

| Issue | Common practice | AetherTab |
|---|---|---|
| API key storage | `chrome.storage` plaintext | AES-GCM encrypted via vault.js |
| Host permissions | `<all_urls>` broad | Explicit domain allowlist only |
| AI output rendering | Raw `innerHTML` | `textContent` only |
| CSP | Often missing | Strict `script-src 'self'` |
| Analytics / telemetry | Often embedded | None |

## Permissions

```json
"permissions": ["storage", "alarms", "sidePanel"],
"host_permissions": [
  "https://api.openai.com/*",
  "https://generativelanguage.googleapis.com/*",
  "https://api.openweathermap.org/*",
  "https://*.railway.app/*",
  "https://api.groq.com/*"
]
```

No `<all_urls>`. No `identity`. No `tabs`. No `webRequest`. No telemetry.

## Roadmap

- **v0.2** — Theme gallery, Shard unlock screen, Settings panel
- **v0.3** — Aetherhaven room portal widgets, encrypted notes  
- **v0.4** — Enterprise consulting CTA, Ko-fi passive drops
- **v1.0** — Chrome Web Store submission

---

*Built by Amara T. — Independent Security Researcher & AI Productivity Builder*\
*Ko-fi: https://ko-fi.com/mellowambience | Hub: https://mellowambience.github.io*

<!-- ✦ Easter egg #1: "The quiet ones build the loudest things." — AetherRose -->
