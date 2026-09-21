# Plan 0358 | Required document-set acceptance

State: CLOSED

## Current State

Completed bounded acceptance: fresh normal-runner C, response
resp_8118eb98d7f94073bf89804c9466719f, completed 19:10:25 UTC with both explicitly
required local files, no helper recovery or extra prompt. Primary verified
complete source text in both files and one PDF page; worker verified current
assistant ownership and retained-browser availability. Review session:
https://previews.bwkuehl.com/s/4856534a6c53. Full proposal autonomy is not claimed.
The real Codex document client now requests DOCX/PDF/ZIP as an explicit set;
its 87 tests pass. A full three-file proposal workflow remains a broader goal gate.

## Historical checkpoints

Installed original DOCX/PDF retrieval is verified, but the runtime output
contract names at most one required artifact. Generic artifact mode accepts
any materialized file. A two-document proposal package needs an explicit set.
One fresh normal-runner regression is independently in flight; do not change
its immutable request or restart the API while it runs.

Source implementation passes 56 focused tests (including 17 document-set
cases), typecheck, and diff hygiene. Invalid sets fail before execution;
explicit sets do not invoke the legacy singular correction prompt. Installation
and an explicit-set normal-runner test remained outstanding at source validation.

Installed at 17:13:52.230Z with complete dist parity and rollback retained.
Staged and installed compiled checks reject a partial pair and accept a complete
pair using injected materialization; live explicit-set normal-runner acceptance
is still outstanding. API PID414477 is active; retained Chrome PID49015 stayed live.

Fresh normal-runner B is now terminal: stored success at 17:06 UTC with only
DOCX materialized and PDF transfer error. Its acceptance failed. This confirms
the live false-completion defect; preserve that history rather than amending
its immutable contract or claiming the test passed.

## Scope and ownership

Primary owns additive `outputContract.artifactFileNames` support in the
configured executor, dedicated tests, and docs. Preserve legacy single-file
wire prompts and semantics. Require every named local file before success;
malformed sets fail before browser submission. A set does not authorize prompt
replay during recovery. Independent worker owns the separate live round trip.

## Acceptance

- DOCX alone cannot satisfy an explicitly required DOCX/PDF set.
- Links, repeated paths and unrelated files cannot satisfy missing files.
- Both correct local filenames pass; legacy single-file tests remain green.
- Required filenames are included in the new request's browser instructions.
- Source and installed checks remain distinct; live adoption must wait until
  the active normal-runner test is terminal.

## Non-goals

No new browser lane, original-request resubmission, fabricated file content,
proposal scientific-validation bypass, or retroactive change to prior prompts.

Definition of done: tested contract is installed and exercised by a normal
runner request with an explicit required document set. Until then remain OPEN.
