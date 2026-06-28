# AetherTab Trust & Safety Security Plan

## Purpose

AetherTab can include cybersecurity in the background only as a defensive, transparent trust-and-safety layer.

This layer should protect users from malicious cartridges, unsafe local content, extension permission creep, and suspicious behavior patterns.

It must not become hidden surveillance.

## Core Principle

Protect the user. Do not spy on the user.

## Allowed Defensive Behaviors

AetherTab may:

- Validate local cartridge metadata before loading.
- Block remote JavaScript entries in HTML6 Arcade/Studio.
- Detect suspicious URLs or executable fields in cartridge JSON.
- Warn users when something is blocked.
- Store local, user-visible security events.
- Let users manually export diagnostics.
- Keep extension permissions minimal.
- Run static checks on built-in cartridges and templates.

## Forbidden Behaviors

AetherTab must not:

- Secretly track users.
- Collect browsing history.
- Fingerprint users.
- Deanonymize users.
- Doxx users.
- Hack, probe, or retaliate against suspicious users.
- Upload private data without explicit user action and consent.
- Claim someone is malicious based on weak signals.
- Add broad Chrome permissions for vague safety reasons.

## HTML6 Cartridge Threat Model

### Assets to protect

- User browser environment
- Gemini/API provider key stored in extension storage
- Local chat history
- Local game data
- User trust
- Extension Web Store reputation

### Main risks

- Malicious cartridge tries to load remote JavaScript.
- Cartridge metadata includes suspicious URLs or executable strings.
- Future sharing/import system allows unsafe content.
- Game module tries to access unrelated app state.
- Renderer dependency weakens CSP.
- Permission creep makes the extension look unsafe.

## CartridgeGuard MVP

Add a local guard module:

```txt
html6/security/
  cartridge-guard.js
  security-events.js
  threat-model.md
```

### CartridgeGuard should check

- Cartridge is valid JSON/object.
- Required fields exist: `html6Version`, `id`, `title`, `entry`, `renderer`.
- `entry` is a local relative path.
- `entry` does not contain `http://`, `https://`, `javascript:`, `data:`, `chrome://`, or `file://`.
- `renderer` is an allowed value: `canvas`, later `pixi`.
- Metadata size is below a defined maximum.
- Unknown executable-like fields are rejected.
- Strings do not contain obvious script injection markers.

## Local Security Events

Security events should be stored locally and visible to the user.

Example:

```json
{
  "type": "cartridge_blocked",
  "cartridgeId": "unknown",
  "reason": "Remote entry URL is not allowed in MVP",
  "timestamp": "2026-06-28T00:00:00.000Z"
}
```

## User-Facing Language

When a cartridge is blocked:

> HTML6 blocked this cartridge because it tried to use something unsafe. Built-in games are still available.

When diagnostics are exported:

> This export contains local security events only. Review it before sharing.

## Privacy Position

Default behavior:

- No automatic uploads.
- No telemetry.
- No browsing-history collection.
- No cross-site tracking.
- No hidden identity checks.

Any future reporting system must be explicit, user-initiated, and previewable before sending.

## Implementation Order

1. Build HTML6 Arcade with built-in local cartridges only.
2. Add CartridgeGuard before importing external/local user cartridges.
3. Add local security event viewer.
4. Add manual diagnostic export.
5. Consider optional reporting only after privacy policy and consent UX exist.

## Release Rule

If a safety feature requires broad permissions, do not add it until there is a specific threat model, user-facing explanation, and privacy review.
