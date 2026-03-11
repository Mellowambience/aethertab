// background.js — AetherTab service worker
// Handles token refresh silently in the background

chrome.runtime.onInstalled.addListener(() => {
  console.log('[AetherTab] Installed ✦');
});

// Listen for alarm to refresh token proactively (optional)
chrome.alarms.create('token-refresh', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'token-refresh') return;
  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (token) {
      chrome.storage.local.set({ token });
    }
  });
});
