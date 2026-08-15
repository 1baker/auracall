---
name: auracall-chatgpt
description: Configure and run AuraCall with ChatGPT through a managed browser profile. Use when the user wants a ChatGPT-backed review, needs first-run browser setup, wants a specific ChatGPT project, or needs help recovering a ChatGPT browser session.
---

# AuraCall ChatGPT

Use AuraCall's managed browser profile so login state and automation state stay
isolated from the user's everyday browser profile.

## Set up ChatGPT

Prefer the guided first-run flow:

```bash
auracall wizard
```

For a known browser binding, bootstrap and verify ChatGPT directly:

```bash
auracall setup --target chatgpt
```

This can open a browser and submit a verification prompt. Add `--skip-verify`
when only browser inspection and login are authorized. Use
`auracall login --target chatgpt` to reopen the configured managed profile for
manual sign-in without submitting a prompt.

On WSL, prefer WSL-native Chrome for the primary path:

```bash
auracall setup --target chatgpt \
  --browser-wsl-chrome wsl \
  --browser-chrome-path /usr/bin/google-chrome
```

Use `--browser-bootstrap-cookie-path` only when intentionally seeding the
managed profile from a different source browser. Do not copy cookie databases
into prompts, logs, or tracked files.

## Run ChatGPT

Attach concrete repository context to every request:

```bash
auracall --chatgpt \
  -p "Review this change for correctness" \
  --file "src/**" --file "tests/**"

auracall --engine browser --model chatgpt:sol-high \
  -p "Diagnose the failure and propose focused tests" \
  --file "src/**" --file "tests/**"
```

Use `chatgpt:sol-high` for a high-effort Sol review. Use `chatgpt:terra` or
`chatgpt:luna` only when the user prefers those current model families.

Pass `--chatgpt-url "https://chatgpt.com/g/.../project"` when a specific
ChatGPT project is required. Persist project, identity, model, and thinking
defaults under the selected `runtimeProfiles.<name>.services.chatgpt` entry in
`~/.auracall/config.json`; prefer `auracall wizard` over hand-authoring a new
profile.

## Recover and troubleshoot

- Run `auracall doctor --target chatgpt --local-only --json` for a passive local
  configuration and managed-profile report.
- Run `auracall profile identity-smoke --target chatgpt --json` to verify the
  configured account binding without submitting a prompt.
- If sign-in expired, run `auracall login --target chatgpt` and complete login
  in the opened managed browser.
- If a run detached, use `auracall status --hours 72` and
  `auracall session <session-id> --render`; do not submit the prompt again.
- Stop on CAPTCHA, account mismatch, or another blocking page and hand control
  to the user.
