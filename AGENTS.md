# AGENTS.md — AetherTab

AetherTab is a secure, lore-driven Chrome new-tab and focus workspace. It should feel magical, but it must ship like a trustworthy browser extension.

## Prime Directive

Make small, verified changes. Do not overbuild.

Every change should move AetherTab closer to one of these goals:

1. Safer Chrome extension permissions
2. Clearer Web Store readiness
3. Better first-run setup
4. Reliable AI/sidebar behavior
5. Better focused new-tab experience
6. Stronger user trust and privacy posture

## Product North Star

AetherTab replaces the new-tab experience with a focused, lore-rich workspace that can include:

- Focus rituals
- Encrypted/local user settings
- Optional AI sidebar
- Weather or ambient widgets
- Void Shards/cosmetic progression
- Notes and small productivity tools
- A clear path to Ko-fi/consulting support without aggressive monetization

## Security Principles

- Use the smallest Chrome permissions possible.
- Do not request `<all_urls>`.
- Do not request `tabs`, `identity`, `webRequest`, or broad host permissions unless the README explains exactly why.
- Do not commit API keys, OAuth secrets, tokens, or private endpoints.
- Do not render model output with raw `innerHTML`.
- Prefer `textContent` for user/model-generated content.
- Keep CSP strict.
- No telemetry by default.
- Make privacy behavior easy to explain to users.

## Scope Control

Do not add without explicit request:

- Social network features
- Marketplace features
- Crypto/NFT systems
- Cloud accounts
- Broad scraping
- Remote code execution
- Unreviewed third-party scripts
- Large framework migrations
- Complex backend dependencies

## Definition of Done

A change is done only when:

- The extension still loads in Chrome dev mode.
- The README matches the implemented behavior.
- Permissions are still minimal and justified.
- No secrets are committed.
- User-facing errors are understandable.
- Any new setup requirement is documented.

## Recommended Work Order

1. Align `manifest.json` permissions with the README security promise.
2. Add a Web Store readiness checklist.
3. Add or improve settings for local provider configuration.
4. Harden storage and output rendering.
5. Improve first-run onboarding.
6. Add polish and screenshots for release.

## Agent Behavior

When working on this repo:

- Inspect existing files before editing.
- Prefer small commits/PRs.
- Keep lore flavor, but do not let it obscure setup or security instructions.
- If a feature conflicts with Web Store trust, choose trust.
- If the README and code disagree, fix the disagreement before adding new features.
