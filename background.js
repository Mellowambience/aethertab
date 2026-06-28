// background.js — AetherTab service worker
// BYOK build: no OAuth token refresh, no hidden background auth.

chrome.runtime.onInstalled.addListener(() => {
  console.log('[AetherTab] Installed ✦ BYOK mode active');
});
