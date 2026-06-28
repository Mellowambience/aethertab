# AetherTab Privacy Policy Draft

This is a draft for local development and Chrome Web Store preparation. Review before publishing.

## Summary

AetherTab is designed as a local-first Chrome extension. It stores settings in Chrome extension storage and does not include analytics or telemetry by default.

## What AetherTab stores locally

AetherTab may store:

- MIST Oracle provider settings
- User-provided Gemini API key
- MIST chat history
- HTML6 Arcade local game data such as best scores
- Local security events in future CartridgeGuard builds

## Where data is stored

Data is stored locally in the user's browser using Chrome extension storage and browser local storage.

## What is sent to Gemini

When the user uses MIST Oracle, their message and relevant chat context are sent to the configured AI provider. In the current build, the default provider is Gemini.

AetherTab does not send prompts to Gemini unless the user uses the MIST Oracle feature.

## API keys

AetherTab uses a bring-your-own-key model. The extension does not ship with an AetherTab-owned Gemini API key.

The user's Gemini API key is stored locally. The current MVP does not implement passphrase-based encryption. Do not publish claims of encrypted API-key storage until that feature exists and is tested.

## HTML6 Arcade

HTML6 Arcade runs built-in local mini-games. The current arcade MVP does not require network access and does not send game activity to a server.

## Telemetry and analytics

AetherTab does not include analytics or telemetry by default.

## What AetherTab does not collect

AetherTab does not intentionally collect:

- Browsing history
- Passwords
- Financial information
- Wallet information
- Location data
- Cross-site tracking identifiers

## Clearing data

Users can clear MIST settings and chat history from inside the extension UI. Users can also remove all extension data by removing AetherTab from Chrome.

## Future security events

Future CartridgeGuard security events should be local and user-visible. AetherTab should not upload security diagnostics automatically. Any future report/export feature must be user-initiated and previewable before sending.

## Contact

Add support/contact information before publishing.
