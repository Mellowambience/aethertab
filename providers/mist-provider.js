// providers/mist-provider.js — Provider switchboard for AetherTab

import { GeminiProvider } from './gemini-provider.js';

const PROVIDERS = {
  gemini: GeminiProvider
};

export function getProvider(providerId = 'gemini') {
  return PROVIDERS[providerId] || GeminiProvider;
}

export function getAvailableProviders() {
  return Object.values(PROVIDERS).map((provider) => ({
    id: provider.id,
    label: provider.label,
    defaultModel: provider.defaultModel,
    requiresApiKey: provider.requiresApiKey
  }));
}

export async function sendMistMessage({ messages, settings }) {
  const provider = getProvider(settings?.provider || 'gemini');
  return provider.sendMessage({
    messages,
    config: settings
  });
}

export async function testMistConnection(settings) {
  const provider = getProvider(settings?.provider || 'gemini');
  return provider.testConnection(settings);
}
