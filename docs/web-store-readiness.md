# AetherTab Chrome Web Store Readiness Checklist

This checklist turns AetherTab from a prototype into a submission-ready Chrome extension.

## 1. Release Goal

AetherTab should ship as a trustworthy, minimal-permission Chrome new-tab/focus workspace with optional AI features and clear privacy language.

## 2. Current Release Blockers

- [ ] Resolve README/manifest mismatch around permissions.
- [ ] Decide whether the AI flow uses Google OAuth or user-provided provider keys.
- [ ] Remove or justify `identity` permission.
- [ ] Remove or justify `tabs` permission.
- [ ] Remove placeholder OAuth client ID before submission.
- [ ] Confirm no secrets or private endpoints are committed.
- [ ] Confirm all user/model-generated text is rendered safely.
- [ ] Add a privacy policy.

## 3. Permissions Review

For each permission in `manifest.json`, document:

| Permission | Needed? | Why | Can it be removed? |
|---|---:|---|---:|
| `storage` | Yes | Saves user settings/history locally. | No |
| `identity` | TBD | Only needed for Chrome OAuth flow. | Yes, if using local provider keys |
| `tabs` | TBD | Avoid unless a feature genuinely needs tab access. | Probably |

For each host permission, document:

| Host | Needed? | Why |
|---|---:|---|
| `https://generativelanguage.googleapis.com/*` | TBD | Gemini API calls if Gemini is supported. |
| `https://www.googleapis.com/*` | TBD | User profile/OAuth only if Google sign-in remains. |

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

AetherTab is built around a minimal-permission security posture. It avoids broad browsing access and stores user configuration locally. AI features are optional and should be configured transparently by the user.

## 8. Local QA Checklist

Before submission:

- [ ] Open `chrome://extensions`.
- [ ] Enable Developer Mode.
- [ ] Load the unpacked extension folder.
- [ ] Confirm no manifest errors.
- [ ] Open a new tab.
- [ ] Confirm UI loads.
- [ ] Test AI setup flow.
- [ ] Test failed/missing API key state.
- [ ] Test clear history/settings.
- [ ] Test reload extension.
- [ ] Confirm no console errors during normal use.
- [ ] Confirm README instructions are accurate.

## 9. Security QA Checklist

- [ ] No secrets committed.
- [ ] No broad host permissions.
- [ ] No `<all_urls>`.
- [ ] No raw `innerHTML` for AI output.
- [ ] CSP remains strict.
- [ ] Permissions are explained in README.
- [ ] Privacy policy matches actual behavior.

## 10. Release Recommendation

Do not submit to the Chrome Web Store until Issue #1 is resolved: the README and `manifest.json` must agree on the extension's permission model.
