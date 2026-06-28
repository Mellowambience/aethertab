# AetherTab Local QA Checklist

Use this checklist to verify the Gemini BYOK build in Chrome.

## What this verifies

- The extension loads in Chrome Developer Mode.
- The new-tab override works.
- The MIST setup screen appears when no Gemini key is stored.
- A user-provided Gemini API key can be saved and tested.
- Chat requests go through the provider wrapper.
- Chat history and settings persist locally.
- Clearing the key returns the extension to setup mode.

## Prerequisites

- Google Chrome or Chromium-based browser
- A Gemini API key from Google AI Studio
- Local checkout of this repo

## Install / Load Unpacked

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the repo folder containing `manifest.json`.
5. Confirm AetherTab appears without manifest errors.

## First-Run Setup Test

1. Open a new tab or click the extension icon.
2. Confirm the setup screen appears.
3. Confirm the provider dropdown shows `Gemini`.
4. Confirm the model field defaults to `gemini-1.5-flash-latest`.
5. Click **Test connection** with no key.
6. Expected: helpful missing-key error appears.

## Gemini Key Test

1. Paste a valid Gemini API key.
2. Click **Test connection**.
3. Expected: success message appears.
4. Click **Save and enter**.
5. Expected: the main chat screen appears.
6. Send: `Say hello in one short sentence.`
7. Expected: MIST returns a Gemini-generated response.

## Persistence Test

1. Close the popup/new tab.
2. Reopen AetherTab.
3. Expected: it goes directly to the main chat screen.
4. Confirm prior chat history appears.

## Clear Chat Test

1. Click **Clear chat**.
2. Expected: chat history disappears.
3. Reopen AetherTab.
4. Expected: cleared chat remains cleared.

## Clear Key Test

1. Click **Clear key**.
2. Expected: setup screen appears again.
3. Reopen AetherTab.
4. Expected: setup screen still appears.

## Invalid Key Test

1. Enter a fake API key.
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
- [ ] README current permissions match `manifest.json`.

## Known Limitation

The current MVP stores the Gemini API key in `chrome.storage.local`. This is local to the browser extension, but it is not the same as passphrase-based encryption. Do not claim AES-GCM vault encryption until that feature is implemented and tested.

## Pass Criteria

The build passes local QA when:

- The extension loads without manifest errors.
- The setup screen handles missing/invalid/valid keys properly.
- A real Gemini request succeeds.
- Chat history persists.
- Clearing key and chat works.
- No uncaught console errors appear during normal use.
