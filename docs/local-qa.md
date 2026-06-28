# AetherTab Local QA Checklist

Use this checklist to verify the Gemini BYOK build and HTML6 Arcade MVP in Chrome.

## What this verifies

- The extension loads in Chrome Developer Mode.
- The new-tab override works.
- AetherTab Home appears as the main navigation.
- MIST Oracle can be configured with a user-provided Gemini API key.
- Chat requests go through the provider wrapper.
- HTML6 Arcade can launch and stop Void Pong.
- Chat history and settings persist locally.
- Clearing the key returns MIST to setup mode.

## Prerequisites

- Google Chrome or Chromium-based browser
- A Gemini API key from Google AI Studio, only needed for MIST Oracle testing
- Local checkout of this repo

## Install / Load Unpacked

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the repo folder containing `manifest.json`.
5. Confirm AetherTab appears without manifest errors.

## Home Navigation Test

1. Open a new tab or click the extension icon.
2. Expected: AetherTab Home appears.
3. Confirm these cards/buttons appear:
   - MIST Oracle
   - HTML6 Arcade
   - Settings

## MIST Setup Test

1. From Home, click **Settings**.
2. Confirm the provider dropdown shows `Gemini`.
3. Confirm the model field defaults to `gemini-1.5-flash-latest`.
4. Click **Test connection** with no key.
5. Expected: helpful missing-key error appears.

## Gemini Key Test

1. Paste a valid Gemini API key.
2. Click **Test connection**.
3. Expected: success message appears.
4. Click **Save and return home**.
5. Open **MIST Oracle**.
6. Send: `Say hello in one short sentence.`
7. Expected: MIST returns a Gemini-generated response.

## HTML6 Arcade Test

1. From Home, click **HTML6 Arcade**.
2. Click **Play Void Pong**.
3. Expected: a pixel-style canvas game appears.
4. Move the paddle with `W/S` or `ArrowUp/ArrowDown`.
5. Confirm the score changes when the ball hits the paddle.
6. Click **Stop game**.
7. Expected: the canvas is removed and the placeholder returns.
8. Click **Home**.
9. Expected: the game stops and AetherTab Home appears.

## Persistence Test

1. Close the popup/new tab.
2. Reopen AetherTab.
3. Expected: Home appears.
4. Open MIST Oracle.
5. Confirm prior chat history appears.

## Clear Chat Test

1. Open MIST Oracle.
2. Click **Clear chat**.
3. Expected: chat history disappears.
4. Reopen AetherTab.
5. Expected: cleared chat remains cleared.

## Clear Key Test

1. Open MIST Oracle.
2. Click **Clear key**.
3. Expected: setup screen appears again.
4. Return Home and reopen MIST Oracle.
5. Expected: sending a MIST message asks for Gemini setup.

## Invalid Key Test

1. Enter a fake API key in Settings.
2. Click **Test connection**.
3. Expected: a friendly invalid-key or provider error appears.

## Console Check

1. Right-click the extension page and inspect.
2. Check the Console tab.
3. Expected: no uncaught runtime errors during normal use.

## Security Check

- [ ] `manifest.json` does not request `identity`.
- [ ] `manifest.json` does not request `tabs`.
- [ ] `manifest.json` does not request `<all_urls>`.
- [ ] No API key is committed to the repo.
- [ ] AI output is inserted with DOM/text APIs, not raw model-output `innerHTML`.
- [ ] HTML6 Arcade runs built-in local cartridge entries only.
- [ ] README current permissions match `manifest.json`.

## Known Limitation

The current MVP stores the Gemini API key in `chrome.storage.local`. This is local to the browser extension, but it is not the same as passphrase-based encryption. Do not claim AES-GCM vault encryption until that feature is implemented and tested.

## Pass Criteria

The build passes local QA when:

- The extension loads without manifest errors.
- Home navigation works.
- The setup screen handles missing/invalid/valid Gemini keys properly.
- A real Gemini request succeeds.
- HTML6 Arcade launches and stops Void Pong.
- Chat history persists.
- Clearing key and chat works.
- No uncaught console errors appear during normal use.
