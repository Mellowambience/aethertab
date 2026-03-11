// popup.js — AetherTab MIST Oracle
// Google OAuth flow: sign in → get token → use Gemini API directly
// Zero manual API key setup. Zero vault passphrase. Just Google.

const GEMINI_MODEL = 'gemini-1.5-flash-latest';
const GEMINI_API  = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';

const screenSignin  = document.getElementById('screen-signin');
const screenLoading = document.getElementById('screen-loading');
const screenMain    = document.getElementById('screen-main');
const btnGoogle     = document.getElementById('btn-google-signin');
const btnSignout    = document.getElementById('btn-signout');
const btnSend       = document.getElementById('btn-send');
const btnClear      = document.getElementById('btn-clear');
const chatInput     = document.getElementById('chat-input');
const chatOutput    = document.getElementById('chat-output');
const userNameEl    = document.getElementById('user-name');
const userAvatarEl  = document.getElementById('user-avatar');
const userAvatarFB  = document.getElementById('user-avatar-fallback');
const statusDot     = document.getElementById('status-dot');
const statusText    = document.getElementById('status-text');
const errorBar      = document.getElementById('error-bar');

let chatHistory = [];

async function init() {
  showScreen('loading');
  const stored = await getStored();
  if (stored.token && stored.user) {
    await activateSession(stored.token, stored.user, stored.history || []);
  } else {
    showScreen('signin');
  }
}

btnGoogle.addEventListener('click', async () => {
  showScreen('loading');
  try {
    const token = await getAuthToken(true);
    const user  = await fetchUserInfo(token);
    await chrome.storage.local.set({ token, user, history: [] });
    await activateSession(token, user, []);
  } catch (err) {
    console.error('Auth failed:', err);
    showScreen('signin');
  }
});

btnSignout.addEventListener('click', async () => {
  const { token } = await getStored();
  if (token) {
    await chrome.identity.removeCachedAuthToken({ token });
    fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token).catch(() => {});
  }
  await chrome.storage.local.clear();
  chatHistory = [];
  showScreen('signin');
});

function getAuthToken(interactive) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(chrome.runtime.lastError || new Error('No token'));
      } else {
        resolve(token);
      }
    });
  });
}

async function fetchUserInfo(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  return res.json();
}

async function activateSession(token, user, history) {
  chatHistory = history;
  userNameEl.textContent = user.given_name || user.name || user.email;
  if (user.picture) {
    userAvatarEl.src = user.picture;
    userAvatarEl.style.display = 'block';
    userAvatarFB.style.display = 'none';
  } else {
    userAvatarFB.textContent = (user.name || user.email || '?').slice(0, 2).toUpperCase();
  }
  const ok = await testGemini(token);
  setStatus(ok, ok ? 'Oracle connected' : 'Oracle offline — check connection');
  renderHistory();
  showScreen('main');
}

btnSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatInput.style.height = 'auto';
  hideError();
  chatHistory.push({ role: 'user', text });
  appendMessage('user', text);
  const loadingEl = appendMessage('oracle', '…');
  btnSend.disabled = true;
  try {
    const { token } = await getStored();
    const reply = await callGemini(token, chatHistory);
    chatHistory.push({ role: 'model', text: reply });
    loadingEl.querySelector('span').textContent = reply;
    await chrome.storage.local.set({ history: chatHistory });
  } catch (err) {
    loadingEl.querySelector('span').textContent = '⚠ Oracle went quiet. Try again.';
    showError(err.message);
  } finally {
    btnSend.disabled = false;
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
}

async function callGemini(token, history) {
  const contents = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
  const res = await fetch(GEMINI_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ contents })
  });
  if (res.status === 401) {
    const newToken = await refreshToken();
    await chrome.storage.local.set({ token: newToken });
    return callGemini(newToken, history);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err && err.error && err.error.message) || ('HTTP ' + res.status));
  }
  const data = await res.json();
  return (data && data.candidates && data.candidates[0] && data.candidates[0].content &&
    data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) || '(no response)';
}

async function testGemini(token) {
  try { await callGemini(token, [{ role: 'user', text: 'ping' }]); return true; }
  catch { return false; }
}

async function refreshToken() {
  const { token: old } = await getStored();
  if (old) await chrome.identity.removeCachedAuthToken({ token: old });
  return getAuthToken(false);
}

function showScreen(name) {
  screenSignin.style.display  = name === 'signin'  ? 'flex' : 'none';
  screenLoading.style.display = name === 'loading' ? 'flex' : 'none';
  screenMain.style.display    = name === 'main'    ? 'flex' : 'none';
}

function appendMessage(role, text) {
  const ph = chatOutput.querySelector('.placeholder');
  if (ph) ph.remove();
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const span = document.createElement('span');
  span.textContent = text;
  div.appendChild(span);
  chatOutput.appendChild(div);
  chatOutput.scrollTop = chatOutput.scrollHeight;
  return div;
}

function renderHistory() {
  chatOutput.innerHTML = '';
  if (!chatHistory.length) {
    chatOutput.innerHTML = '<div class="placeholder">Ask the void…</div>';
    return;
  }
  for (const m of chatHistory) appendMessage(m.role === 'model' ? 'oracle' : 'user', m.text);
}

function setStatus(online, text) {
  statusDot.className = 'status-dot' + (online ? '' : ' offline');
  statusText.textContent = text;
}

function showError(msg) { errorBar.textContent = msg; errorBar.style.display = 'block'; }
function hideError() { errorBar.style.display = 'none'; }

btnClear.addEventListener('click', async () => {
  chatHistory = [];
  await chrome.storage.local.set({ history: [] });
  renderHistory();
});

function getStored() {
  return new Promise(resolve => chrome.storage.local.get(['token', 'user', 'history'], resolve));
}

init();
