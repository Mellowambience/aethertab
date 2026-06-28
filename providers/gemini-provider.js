// providers/gemini-provider.js — Gemini BYOK implementation

const DEFAULT_MODEL = 'gemini-1.5-flash-latest';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GeminiProvider = {
  id: 'gemini',
  label: 'Gemini',
  requiresApiKey: true,
  defaultModel: DEFAULT_MODEL,

  validateConfig(config = {}) {
    if (!config.apiKey || !config.apiKey.trim()) {
      return { ok: false, message: 'Add your Gemini API key in Settings first.' };
    }
    return { ok: true };
  },

  async testConnection(config = {}) {
    const validation = this.validateConfig(config);
    if (!validation.ok) return validation;

    try {
      await this.sendMessage({
        messages: [{ role: 'user', text: 'Reply with only: ok' }],
        config
      });
      return { ok: true, message: 'Gemini connected.' };
    } catch (err) {
      return { ok: false, message: friendlyGeminiError(err) };
    }
  },

  async sendMessage({ messages, config = {} }) {
    const validation = this.validateConfig(config);
    if (!validation.ok) throw new Error(validation.message);

    const model = config.model || DEFAULT_MODEL;
    const endpoint = `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;

    const contents = messages.map((message) => ({
      role: message.role === 'model' ? 'model' : 'user',
      parts: [{ text: message.text }]
    }));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const providerMessage = payload?.error?.message || `Gemini returned HTTP ${response.status}`;
      throw new Error(providerMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '(MIST heard the void, but Gemini returned no text.)';
  }
};

export function friendlyGeminiError(err) {
  const message = String(err?.message || err || 'Unknown provider error');

  if (/API key not valid|API_KEY_INVALID|key/i.test(message)) {
    return 'Gemini rejected that API key. Check the key and try again.';
  }
  if (/quota|rate|RESOURCE_EXHAUSTED/i.test(message)) {
    return 'Gemini rate limit or quota reached. Wait a bit or try another key.';
  }
  if (/Failed to fetch|NetworkError|network/i.test(message)) {
    return 'MIST could not reach Gemini. Check your connection and try again.';
  }

  return message;
}
