# AetherTab AI Provider Strategy

## Decision

AetherTab should use a bring-your-own-key AI provider architecture.

Default provider:

- Gemini

Planned fallback provider:

- Groq

Possible advanced provider later:

- OpenRouter

## Why Gemini First

Gemini is the best first provider for AetherTab because:

- It has a developer-friendly free tier for small experiments.
- It fits naturally with a Chrome-based extension ecosystem.
- It is strong enough for a lightweight MIST Oracle assistant.
- It is easy for users to create their own API key.

## Security Rule

Never bundle an AetherTab-owned API key inside the extension.

The extension should not ship with:

- Hardcoded provider keys
- OAuth client secrets
- Private backend tokens
- Personal API keys

The user should provide their own key in Settings.

## Recommended Architecture

```txt
popup / side panel UI
  -> MistProvider
    -> GeminiProvider
    -> GroqProvider later
    -> OpenRouterProvider later
```

Suggested files:

```txt
providers/
  mist-provider.js
  gemini-provider.js
  groq-provider.js
  openrouter-provider.js
```

## Provider Interface

Each provider should expose the same basic shape:

```js
{
  id: 'gemini',
  label: 'Gemini',
  requiresApiKey: true,
  defaultModel: 'gemini-flash-lite',
  validateConfig(config),
  testConnection(config),
  sendMessage({ messages, config })
}
```

Model names should be easy to update from settings or constants because provider model availability changes over time.

## Settings UX

The user should be able to:

- Choose provider
- Paste API key
- Choose model if needed
- Test connection
- Clear key
- Clear chat history
- Read a plain-language privacy note

Suggested warning copy:

> AI features are optional. Your provider key is stored locally in this browser extension. Do not paste sensitive information into free-tier AI providers.

## Storage

Use `chrome.storage.local` for MVP.

If encryption is implemented, derive a local vault key from a user passphrase. If encryption is not implemented yet, the UI and README must honestly say the key is stored locally by Chrome extension storage.

Do not imply stronger encryption than what exists.

## Permission Direction

The Gemini-first BYOK architecture should allow removal of Chrome OAuth if no Google sign-in is needed.

Preferred manifest direction:

```json
{
  "permissions": ["storage"],
  "host_permissions": [
    "https://generativelanguage.googleapis.com/*"
  ]
}
```

Only add additional host permissions when adding a provider.

## Error States

AetherTab should handle:

- Missing API key
- Invalid API key
- Rate limit exceeded
- Network failure
- Provider unavailable
- Empty model response

Errors should be understandable and non-scary.

Example:

> MIST could not reach Gemini. Check your API key or try again later.

## Roadmap

### Phase 1

- Resolve README/manifest permission mismatch.
- Decide BYOK over OAuth.
- Remove unused permissions.

### Phase 2

- Add Gemini provider wrapper.
- Add Settings UI for Gemini API key.
- Update README.
- Test in Chrome dev mode.

### Phase 3

- Add Groq as an optional fast fallback.
- Add provider dropdown.
- Add model dropdown.

### Phase 4

- Add OpenRouter as an advanced multi-model option if useful.

## Non-Goals

Do not build now:

- A paid proxy backend
- Account system
- Marketplace
- Analytics/telemetry
- Cross-device sync
- Complex agent orchestration

The MVP should be simple: user brings a key, MIST replies, the extension stays trustworthy.
