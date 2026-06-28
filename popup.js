// popup.js — AetherTab MIST Oracle BYOK flow

import { sendMistMessage, testMistConnection } from './providers/mist-provider.js';

const STORAGE_KEYS = ['mistSettings', 'history'];
const DEFAULT_SETTINGS = {
  provider: 'gemini',
  model: 'gemini-1.5-flash-latest',
  apiKey: ''
};

const screenSetup = document.getElementById('screen-setup');
const screenLoading = document.getElementById('screen-loading');
const screenMain = document.getElementById('screen-main');

const providerSelect = document.getElementById('provider-select');
const modelInput = document.getElementById('model-input');
const apiKeyInput = document.getElementById('api-key-input');
const btnSaveSettings = document.getElementById('btn-save-settings');
const btnTestSettings = document.getElementById('btn-test-settings');
const setupError = document.getElementById('setup-error');
const setupSuccess = document.getElementById('setup-success');

const btnSend = document.getElementById('btn-send');
const btnClear = document.getElementById('btn-clear');
const btnSettings = document.getElementById('btn-settings');
const btnClearSettings = document.getElementById('btn-clear-settings');
const chatInput = document.getElementById('chat-input');
const chatOutput = document.getElementById('chat-output');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const errorBar = document.getElementById('error-bar');

let chatHistory = [];
let mistSettings = { ...DEFAULT_SETTINGS };

init();

async function init() {
  showScreen('loading');
  const stored = await getStored();
  chatHistory = Array.isArray(stored.history) ? stored.history : [];
  mistSettings = { ...DEFAULT_SETTINGS, ...(stored.mistSettings || {}) };
  hydrateSettingsForm();

  if (mistSettings.apiKey) {
    renderHistory();
    setStatus(true, 'Gemini configured');
    showScreen('main');
  } else {
    showScreen('setup');
  }
}

btnSaveSettings.addEventListener('click', async () => {
  hideSetupMessages();
  const settings = readSettingsForm();

  if (!settings.apiKey) {
    showSetupError('Paste your Gemini API key first.');
    return;
  }

  await saveSettings(settings);
  setStatus(true, 'Gemini configured');
  renderHistory();
  showScreen('main');
});

btnTestSettings.addEventListener('click', async () => {
  hideSetupMessages();
  const settings = readSettingsForm();

  if (!settings.apiKey) {
    showSetupError('Paste your Gemini API key first.');
    return;
  }

  btnTestSettings.disabled = true;
  btnTestSettings.textContent = 'Testing…';

  try {
    const result = await testMistConnection(settings);
    if (result.ok) {
      showSetupSuccess(result.message || 'Gemini connected.');
    } else {
      showSetupError(result.message || 'Gemini connection failed.');
    }
  } finally {
    btnTestSettings.disabled = false;
    btnTestSettings.textContent = 'Test connection';
  }
});

btnSettings.addEventListener('click', () => {
  hydrateSettingsForm();
  hideSetupMessages();
  showScreen('setup');
});

btnClearSettings.addEventListener('click', async () => {
  await chrome.storage.local.remove('mistSettings');
  mistSettings = { ...DEFAULT_SETTINGS };
  hydrateSettingsForm();
  chatHistory = [];
  await chrome.storage.local.set({ history: [] });
  showScreen('setup');
});

btnSend.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
});

btnClear.addEventListener('click', async () => {
  chatHistory = [];
  await chrome.storage.local.set({ history: [] });
  renderHistory();
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  if (!mistSettings.apiKey) {
    showError('Add your Gemini API key in Settings first.');
    showScreen('setup');
    return;
  }

  chatInput.value = '';
  chatInput.style.height = 'auto';
  hideError();

  chatHistory.push({ role: 'user', text });
  appendMessage('user', text);
  const loadingEl = appendMessage('oracle', '…');
  btnSend.disabled = true;

  try {
    const reply = await sendMistMessage({
      messages: chatHistory,
      settings: mistSettings
    });

    chatHistory.push({ role: 'model', text: reply });
    loadingEl.querySelector('span').textContent = reply;
    await chrome.storage.local.set({ history: chatHistory });
    setStatus(true, 'Oracle connected');
  } catch (err) {
    const message = err?.message || 'MIST went quiet. Try again.';
    loadingEl.querySelector('span').textContent = '⚠ Oracle went quiet. Try again.';
    showError(message);
    setStatus(false, 'Oracle offline');
  } finally {
    btnSend.disabled = false;
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
}

function hydrateSettingsForm() {
  providerSelect.value = mistSettings.provider || DEFAULT_SETTINGS.provider;
  modelInput.value = mistSettings.model || DEFAULT_SETTINGS.model;
  apiKeyInput.value = mistSettings.apiKey || '';
}

function readSettingsForm() {
  return {
    provider: providerSelect.value || DEFAULT_SETTINGS.provider,
    model: modelInput.value.trim() || DEFAULT_SETTINGS.model,
    apiKey: apiKeyInput.value.trim()
  };
}

async function saveSettings(settings) {
  mistSettings = { ...DEFAULT_SETTINGS, ...settings };
  await chrome.storage.local.set({ mistSettings });
}

function renderHistory() {
  clearElement(chatOutput);

  if (!chatHistory.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.textContent = 'Ask the void…';
    chatOutput.appendChild(placeholder);
    return;
  }

  for (const message of chatHistory) {
    appendMessage(message.role === 'model' ? 'oracle' : 'user', message.text);
  }
}

function appendMessage(role, text) {
  const placeholder = chatOutput.querySelector('.placeholder');
  if (placeholder) placeholder.remove();

  const wrapper = document.createElement('div');
  wrapper.className = `msg ${role}`;

  const bubble = document.createElement('span');
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  chatOutput.appendChild(wrapper);
  chatOutput.scrollTop = chatOutput.scrollHeight;
  return wrapper;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function showScreen(name) {
  screenLoading.style.display = name === 'loading' ? 'flex' : 'none';
  screenSetup.style.display = name === 'setup' ? 'flex' : 'none';
  screenMain.style.display = name === 'main' ? 'flex' : 'none';
}

function setStatus(online, text) {
  statusDot.className = `status-dot${online ? '' : ' offline'}`;
  statusText.textContent = text;
}

function showError(message) {
  errorBar.textContent = message;
  errorBar.style.display = 'block';
}

function hideError() {
  errorBar.style.display = 'none';
}

function showSetupError(message) {
  setupError.textContent = message;
  setupError.style.display = 'block';
  setupSuccess.style.display = 'none';
}

function showSetupSuccess(message) {
  setupSuccess.textContent = message;
  setupSuccess.style.display = 'block';
  setupError.style.display = 'none';
}

function hideSetupMessages() {
  setupError.style.display = 'none';
  setupSuccess.style.display = 'none';
}

function getStored() {
  return new Promise((resolve) => chrome.storage.local.get(STORAGE_KEYS, resolve));
}
