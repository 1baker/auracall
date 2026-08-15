---
name: auracall-gemini
description: Configure and run AuraCall with Gemini through managed-browser or API execution. Use when the user wants a Gemini-backed review, needs first-run Gemini setup, targets a specific Gem URL, or needs help with Gemini login and session recovery.
---

# AuraCall Gemini

Use managed-browser execution for a signed-in Gemini account. Use API execution
only after the user consents to billable usage and configures a Gemini key.

## Set up Gemini web

Prefer the guided first-run flow:

```bash
auracall wizard
```

For a known browser binding, bootstrap and verify Gemini directly:

```bash
auracall setup --target gemini --export-cookies
```

This can open a browser and submit a verification prompt. Add `--skip-verify`
when only browser inspection, login, and cookie export are authorized. Use
`auracall login --target gemini --export-cookies` to reopen the managed profile
without submitting a prompt.

On WSL, prefer WSL-native Chrome for the primary path:

```bash
auracall setup --target gemini \
  --browser-wsl-chrome wsl \
  --browser-chrome-path /usr/bin/google-chrome \
  --export-cookies
```

Cookie export writes `~/.auracall/cookies.json`. Treat it as a secret: never
attach it to a prompt, print it, or commit it.

## Run Gemini web

```bash
auracall --gemini \
  -p "Review this change for correctness" \
  --file "src/**" --file "tests/**"

auracall --engine browser --model gemini-3-pro \
  --gemini-url "https://gemini.google.com/gem/<id>" \
  -p "Find the root cause and propose focused tests" \
  --file "src/**" --file "tests/**"
```

Persist identity, model, and browser defaults in the selected AuraCall runtime
profile. Prefer `auracall wizard` over hand-authoring a new profile.

## Run Gemini API

After explicit cost consent, set `GEMINI_API_KEY` outside tracked files and run:

```bash
auracall --engine api --model gemini-3-pro \
  -p "Cross-check this design" \
  --file "src/**" --file "docs/architecture.md"
```

## Recover and troubleshoot

- Run `auracall doctor --target gemini --local-only --json` for a passive local
  configuration and managed-profile report.
- Run `auracall profile identity-smoke --target gemini --json` to verify the
  configured account binding without submitting a prompt.
- If cookies or sign-in expired, run
  `auracall login --target gemini --export-cookies` and sign in manually.
- If a run detached, use `auracall status --hours 72` and
  `auracall session <session-id> --render`; do not submit the prompt again.
- Stop on CAPTCHA, account mismatch, or another blocking page and hand control
  to the user.
