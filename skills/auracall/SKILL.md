---
name: auracall
description: Use the AuraCall CLI to bundle a prompt with relevant files and obtain a second-model review through API or managed-browser execution. Use for debugging, refactoring, design review, or cross-validation when another model needs concrete repository context.
---

# AuraCall

Use AuraCall as an advisory second-model reviewer. Verify its conclusions
against the repository and tests before adopting them.

## Prepare the runtime

- From an AuraCall checkout, run `pnpm run install:user-runtime` once.
- Run `auracall --help` before first use in a session.
- Use `auracall wizard` for guided browser-profile setup, or
  `auracall setup --target <chatgpt|gemini|grok>` when the target and browser
  binding are already known.
- Treat `setup` as effectful: it can open a browser and send a verification
  prompt unless `--skip-verify` is supplied.

## Build a focused request

1. Select the smallest set of files that contains the relevant behavior,
   configuration, tests, and constraints.
2. Preview the bundle before sending it.
3. Choose browser or API execution explicitly when cost or account effects
   matter.
4. Reattach to an existing session after a timeout or detach; do not duplicate
   the request.

```bash
auracall --dry-run summary --files-report \
  -p "Review this implementation for correctness and missing tests" \
  --file "src/**" --file "!src/**/*.test.ts"

auracall --dry-run full \
  -p "Review this implementation" \
  --file "src/**"
```

## Run a review

Use managed-browser execution for an interactive signed-in provider account:

```bash
auracall --engine browser --model chatgpt:sol-high \
  -p "Find the root cause, propose the smallest fix, and name the tests" \
  --file "src/**" --file "tests/**"
```

Use API execution only after the user consents to billable usage and the
required provider key is configured:

```bash
auracall --engine api --model gpt-5.1-pro \
  -p "Cross-check this design" \
  --file "src/**" --file "docs/architecture.md"
```

For manual paste, render the complete bundle without contacting a provider:

```bash
auracall --render --copy \
  -p "Review this change" \
  --file "src/**" --file "tests/**"
```

## Attach files safely

- Repeat `--file` for files, directories, or globs.
- Prefix exclusions with `!`, such as `--file "!**/*.snap"`.
- Use `--dry-run summary --files-report` to inspect token-heavy inputs.
- Explicitly include dot-directories when needed, such as
  `--file ".github/**"`.
- Split or narrow files larger than 1 MB.
- Never attach `.env`, private keys, access tokens, cookie databases, or other
  secrets. Redact sensitive data before sending.

## Recover sessions

Sessions live under `~/.auracall/sessions` by default. Assign a memorable slug,
inspect recent sessions, and reattach instead of starting duplicates:

```bash
auracall status --hours 72
auracall session <session-id> --render
```

Use `--force` only when a genuinely new run is required.

## Use remote browser execution

Run the browser service on the signed-in host and connect from the client:

```bash
auracall serve --host 127.0.0.1 --port 9473 --token <secret>
auracall --engine browser --remote-host <host:port> --remote-token <secret> \
  -p "Review this change" --file "src/**"
```

Keep the service loopback-bound unless an authenticated private transport
protects it. Never expose the token in logs or tracked files.

## Write a self-contained prompt

Include the stack, build and test commands, relevant paths, exact error text,
attempted fixes, constraints, and desired output. Assume the consulted model
knows nothing about the repository beyond the attached files.
