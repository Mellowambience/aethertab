# AetherTab — Google OAuth Setup Guide

## What changed

**Before:** User enters API key → creates vault passphrase → enters passphrase every session  
**After:** Click "Continue with Google" → done ✓

No keys. No passwords. Google handles everything.

---

## Files

```
aethertab/
├── manifest.json      ← Extension config (MV3 + OAuth2)
├── popup.html         ← New UI (sign-in screen + chat screen)
├── popup.js           ← Auth logic + Gemini API calls
├── background.js      ← Token refresh service worker
└── icons/             ← Your existing icons (copy from old extension)
```

---

## One-time Google Cloud Setup (5 min)

You need a **Google OAuth Client ID** for the extension. Do this once.

### Step 1: Create OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing) → **APIs & Services → Credentials**
3. Click **Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Chrome Extension**
5. For "Application ID", enter your **extension ID**
   - Load the extension in Chrome first (unpacked), copy the ID from `chrome://extensions`
6. Click **Create** — copy the **Client ID**

### Step 2: Enable Gemini API

1. In Google Cloud Console → **APIs & Services → Library**
2. Search "Generative Language API" → **Enable**

### Step 3: Put client ID in manifest.json

Open `manifest.json` and replace:
```json
"client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```
with your actual client ID.

---

## How the auth flow works

```
User clicks "Continue with Google"
        ↓
chrome.identity.getAuthToken()
(Chrome shows Google's sign-in popup)
        ↓
Google returns OAuth token
        ↓
We fetch user profile (name, avatar)
        ↓
We use that same token to call Gemini API
        ↓
Token auto-refreshes in background — user never re-enters anything
```

**Why this works:** Gemini API accepts Google OAuth tokens directly — no separate API key needed when the user has a Google account.

---

## Token refresh

- Background service worker refreshes the token every 30 min silently
- If a call ever gets a 401, popup.js automatically gets a fresh token and retries
- User never sees a "please log in again" screen unless they explicitly sign out

---

## Loading into Chrome

1. Open `chrome://extensions`
2. Toggle **Developer mode** ON
3. Click **Load unpacked** → select the `aethertab/` folder
4. The extension appears — click it to test

---

## Notes

- Chat history persists in `chrome.storage.local` between sessions
- Signing out clears history + revokes the Google token
- The Gemini model is set to `gemini-1.5-flash-latest` (free tier, fast)
  - To change: edit `GEMINI_MODEL` at top of `popup.js`
