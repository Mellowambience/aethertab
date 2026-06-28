// html6/security/security-events.js — local, user-visible security event helpers

const STORAGE_KEY = 'html6SecurityEvents';
const MAX_EVENTS = 50;

export async function recordSecurityEvent(event) {
  const existing = await getSecurityEvents();
  const nextEvent = {
    ...event,
    timestamp: new Date().toISOString()
  };
  const next = [nextEvent, ...existing].slice(0, MAX_EVENTS);
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return nextEvent;
}

export async function getSecurityEvents() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (stored) => {
      resolve(Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY] : []);
    });
  });
}

export async function clearSecurityEvents() {
  await chrome.storage.local.set({ [STORAGE_KEY]: [] });
}
