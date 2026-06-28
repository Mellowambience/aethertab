# AetherTab Chrome Web Store Readiness Checklist

This checklist turns AetherTab from a prototype into a submission-ready Chrome extension.

## 1. Release Goal

AetherTab should ship as a trustworthy, minimal-permission Chrome new-tab/focus workspace with optional AI features and clear privacy language.

## 2. Current Release Blockers

- [ ] Run the local QA checklist in [`docs/local-qa.md`](local-qa.md).
- [ ] Verify a real Gemini API key can connect.
- [ ] Confirm no manifest errors in Chrome Developer Mode.
- [ ] Add a privacy policy.
- [ ] Prepare Chrome Web Store screenshots and listing copy.
- [ ] Decide whether passphrase-based key encryption is required before public release.

## 3. Permissions Review

Current intended manifest direction:

| Permission | Needed? | Why | Can it be removed? |
|---|---:|---|---:|
| `storage` | Yes | Saves user settings/history locally. | No |

Current intended host permissions:

| Host | Needed? | Why |
|---|---:|---|
| `https://generativelanguage.googleapis.com/*` | Yes | Gemini BYOK provider requests. |

Avoid:

- `<all_urls>`
- `identity`
- `tabs`
- `webRequest`
- broad host permissions

## 4. Privacy Policy Requirements

The privacy policy should plainly state:

- What data is stored locally.
- Whether chat history is stored.
- Whether API keys/tokens are stored.
- Whether any data is sent to AI providers.
- Which AI providers may receive prompts.
- Whether analytics/telemetry exist.
- How users can clear local data.

Recommended posture:

- No telemetry by default.
- No selling user data.
- Local settings storage only.
- AI requests sent only when the user explicitly asks the AI feature something.
- User brings their own AI provider key.

## 5. Store Listing Assets

Prepare:

- [ ] 128x128 icon
- [ ] 48x48 icon
- [ ] 32x32 icon
- [ ] 16x16 icon
- [ ] At least 1 screenshot
- [ ] 3-5 screenshots recommended
- [ ] Short description
- [ ] Full description
- [ ] Category
- [ ] Privacy policy URL
- [ ] Support/contact URL or email

## 6. Suggested Short Description

A lore-rich new tab workspace for focus rituals, ambient productivity, and optional AI assistance.

## 7. Suggested Full Description Draft

AetherTab replaces your new tab with a focused, magical workspace designed for calm productivity. It combines a lore-driven interface with practical tools like local settings, ambient focus cues, and optional AI assistance.

AetherTab uses a bring-your-own-key AI setup. The extension does not ship with a bundled AI provider key. User configuration is stored locally in Chrome extension storage, and AI requests are sent only when the user explicitly uses the MIST Oracle feature.

## 8. Local QA Checklist

Before submission, complete [`docs/local-qa.md`](local-qa.md).

Minimum pass requirements:

- [ ] Extension loads unpacked without manifest errors.
- [ ] New tab override opens AetherTab.
- [ ] Missing key state works.
- [ ] Invalid key state works.
- [ ] Valid Gemini key test works.
- [ ] MIST chat response works.
- [ ] Clear chat works.
- [ ] Clear key works.
- [ ] No uncaught console errors during normal use.
- [ ] README instructions are accurate.

## 9. Security QA Checklist

- [ ] No secrets committed.
- [ ] No broad host permissions.
- [ ] No `<all_urls>`.
- [ ] No `identity` unless OAuth is intentionally reintroduced.
- [ ] No `tabs` unless a future feature genuinely needs it.
- [ ] No raw `innerHTML` for AI output.
- [ ] CSP remains strict.
- [ ] Permissions are explained in README.
- [ ] Privacy policy matches actual behavior.

## 10. Release Recommendation

Do not submit to the Chrome Web Store until local QA passes with a real Gemini API key and the privacy policy is published.
