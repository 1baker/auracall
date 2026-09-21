# Plan 0359 | Conversation-capacity recovery

State: OPEN
Lane: P01

## Current State

2026-09-19 fresh-project broker continuation is blocked before Send by a
local-headed retained browser whose `displayIsolation` inventory field is null,
despite one ready `cdp_screencast` / `cdp_input` stream and one exact retained
session. The bridge now binds that null value explicitly: it omits the optional
access-plan field, still requires one ready browser/session/stream, and
rechecks the same null value after planning. A focused regression covers this
valid posture; live install and one fresh-project prompt/response proof remain
pending.

Live retry after installation reached the required native attachment on retained
browser PID 657110 and created exact target `66473C43CC0841E269DB199E2D3ACD23`.
The native CDP connection then failed before durable prompt-dispatch evidence.
The target URL converged to a fresh Workshop conversation, but the cleanup path
closed that target on the uncertain `connection-lost` error. The response is
therefore intentionally unreplayable: `resp_6b11b45fbfe346fd9b9c44354cece515`
must not be retried. Remaining acceptance work is to classify a required
new-project connection loss as typed after-submit uncertainty, preserve the
target, and recover it through one exact broker reattach/detach.

Real authority blocker confirmed: native `broker_authority::native_action` maps
Runtime.evaluate to evaluate/ScriptExecution, and the ordered issuer explicitly
rejects evaluate plans. Primary reran
`broker_attach_issuance_does_not_enable_other_lifecycle_or_url_changes`: passed,
including that rejection. Thus synthetic capture fixtures do not establish native
permission for account/response reads. Do not widen generic script authority as a
workaround. A separately reviewed, approval-bound capability for the exact recovery
reads is required before combined native response recovery can pass. No live
permission or runtime configuration was changed during this diagnosis.

Native transport process-failure proof now uses a real SIGKILL after a saved,
fsynced binding receipt and a distinct recovery process. Lost detach acknowledgement
is simulated by dropping the actual worker's successful reply; a fresh connector
confirms cleanup without a second CDP detach. The isolated native test passed,
including real worker counters and retained fixture-browser preservation. This
advances transport acceptance, not full stored-response crash recovery: HTTP
reacquisition/executor crash boundaries and native approved response authority
still need combined proof. Primary also passed 104 focused tests, typecheck/build
and syntax check. No production code, native source or installed runtime changed.

Stored native response capture is now wired in source, superseding the runtime
gate described in prior packets below. Complete submitted identity, explicit
native configuration and a real evidence writer are mandatory. The executor
reconciles the old attachment, reacquires the exact target, persists the new
binding before native reads, checks account/prompt/URL and publishes only after
verified cleanup. Cancellation propagates through both calls. Newest native
evidence outranks legacy endpoint hints without losing its marker. Primary passed
309 tests across eighteen suites, full typecheck/build and changed-test lint.
Actual native process-crash/transient acceptance, approved task delivery and
default activation remain open; synthetic fixture success is not live readiness.
No prompt, install, restart or GitHub write.

Original-attachment reconciliation primitive now exists for a surviving native
daemon. Internal reattach accepts the saved binding, checks the exact ready
retained target/URL/route/ownership, confirms original detach before fresh attach,
and rejects reuse of the old attachment ID. Failed/unknown cleanup cannot advance.
Primary passed 258 tests across thirteen suites, including eight new reconciliation
cases. This uses synthetic HTTP plus real Unix-socket fixtures, not live Chrome.
Next critical path: broker-scoped response capture and executor integration, then
actual native cross-process crash/transient recovery. Existing runtime gate stays
closed; daemon-loss reconciliation and full approved task delivery remain open.

Provider routing packet is source-verified: explicit nonserializable native
transport reaches ChatGPT/Grok and bypasses raw endpoint discovery. All work after
acquisition is inside shared cleanup. Runtime evidence retains the native marker
and complete six-field binding without credentials. Stored/transient recovery is
deliberately blocked pending original-attachment reconciliation, including mixed
legacy/native evidence that otherwise lets host/port scoring erase provenance.
Direct native reattach cannot reopen Chrome. Primary passed 250 tests in thirteen
suites, full typecheck/build and strict new-test lint. Wider lint and plan audit
retain existing findings (RUNBOOK). CodeGraph traced callers and was synced.
No install, live prompt, browser restart or GitHub write. Native recovery and
approved provider task delivery remain open; this is not seamless live readiness.

Native handoff packet verified in source/socket fixtures: explicit configuration
reaches initial and recovery acquisition. The bridge sends supplied ordered attach
authority through existing HTTP action parameters, validates the opaque binding
and canonical receipt, and returns a lazy cleanup owner instead of Chrome host/port.
The shared connection helper consumes that owner. Client and outer cleanup share
one verified sticky detach, including pre-admission failure and cancellation.
Unknown identity never uses legacy cleanup; auto/off cannot silently fall back.
Primary passed 238 tests across eleven suites (32 new acquisition cases), full
typecheck/build, changed-test lint and diff check. Native HTTP parsing/relay was
source-inspected, not exercised by the new synthetic HTTP fixture. Provider option
plumbing, approved command authority, cross-process acquisition/crash recovery and
live activation remain unfinished. No credentials discovery, install or prompt.

Cleanup publication packet verified in source: `withAgentBrowserBrokerCleanup`
no longer returns a completed provider result after unverified cleanup. It throws
an after-operation, non-retryable classification that survives executor recovery;
diagnostic callbacks cannot substitute for reconciliation or mask the classification.
Primary reproduced the old success/observer masking, then passed 178 tests across
ten suites and full typecheck. Initial and recovered execution both stop before
artifact materialization without replaying the provider action. Falsy rejections
also remain failures. Native acquisition/configuration and shared cleanup wiring
remain next; this does not install or establish live readiness.

Connection-wiring prerequisite: `connectToChromeTarget` now forwards the run
abort signal to the explicit broker client. Cancellation seals pending commands
and event publication without replay; owner-awaited `close()` remains independent,
idempotent and sticky on detach failure. Two regression cases failed before the
fix; 166 tests across nine connection/broker/recovery suites now pass, plus full
typecheck, build, diff check and strict changed-test lint. Plan audit retains
three existing errors (RUNBOOK has exact findings). This does not select the native transport
in providers or establish live readiness. No install, browser input or GitHub write.

Required-mode acquisition now has a narrow native issuance path: an ordered
`cdp_attach` step names the exact current URL, retains the read-only ceiling and
requires its own confirmation. Raw transport, mismatched URLs/target and missing
v2 issuance fail before reservation. Governed task controls retain confirmations
under transferred custody. The actual issue/confirm/attach/confirm/command/cleanup
test passes with required mode enabled. It exposed a default-stack overflow;
heap-owning the dispatcher frame fixed it without changing the public async API.
The cross-process connector test also passes. Full isolated native validation:
2169 passed, 75 ignored, zero failures; build/Clippy/format/diff passed.
Provider wiring, pending-attachment
crash reconciliation, downloads/descendant targets and live verification remain
open; this supersedes the required-acquisition gap below, not final readiness.

Confirmed-acquisition prerequisite resolved in native source: a private snapshot
binds original action policy and confirmation rules to the approved acquisition
command ID. Later broker commands receive no inherited approval. Missing or
mismatched capture is still denied. Real confirmation, explicit policy denial and
exact cleanup regressions pass: broker 63, confirmation 17 (overlapping), plus the
explicit cross-process test. Required-mode lifecycle task issuance and provider
configuration remain open; no installed runtime change or browser input.

Cross-process checkpoint: the built AuraCall connector passed against the actual
native authenticated handler, custody-backed registry and ordered task ledger.
Only Chrome's protocol peer was synthetic. Two issued steps completed; replay
from a fresh connector and exhausted authority were rejected; two detach calls
produced one actual CDP detach and preserved the browser. Native broker suite:
61 passed plus the separately run opt-in cross-process test. Required-mode
lifecycle issuance, authority-aware acquisition/provider configuration, confirmed
policy capture, crash reconciliation and live verification remain incomplete.
This supersedes the fake-daemon-only limitation below, not the live-provider gate.

Send-once connector checkpoint: `nativeBrokerTransport.ts` now implements the
authenticated native Unix wire protocol, one socket per operation, with fixed
acquisition binding, independent cancellation and no reconnect/replay. A required
callback supplies existing ordered task context; it cannot issue permission.
Cleanup remains independent of that callback. Primary passed 15 socket fixtures
and 156 total tests across nine suites, full typecheck/build and changed-test lint.
Closed-world source review found no blocker in this bounded connector slice.
The next proof is a cross-process test against the actual native worker and real
task ledger, followed by provider acquisition/config wiring. Fixture daemon replies
do not establish custody. Required lifecycle issuance, crash reconciliation,
downloads/descendant targets, installation and live verification remain open.

Event checkpoint supersedes the earlier task-aware event gap below: native broker
event reads now use explicit task admission, exact-session filtering, durable
request identities and full framed-output byte limits. Native broker filter:
61 passed; details and digests are in the recovery checkout RUNBOOK. AuraCall's
explicit client now generates and verifies event request IDs, including empty
polls, and rejects stale/missing/late replies without replay or listener delivery.
Primary AuraCall validation: 141 tests across eight suites, full typecheck/build,
strict changed-test lint and diff check. CodeGraph synced the changed files.
No runtime replacement or browser input. Send-once native connector with approved
per-request task context, required lifecycle issuance, provider/download/iframe
routing and crash reconciliation remain open. This is staged, not seamless live
operation; do not enable the provider path from these source tests alone.

Worker acquisition checkpoint supersedes the unwired-acquisition state below:
experimental native `cdp_attach` with `brokerTransport: true` now acquires through
the real transferred-custody owner and returns an opaque binding/canonical handle.
Stored access-plan selection, exact identity and actual target URL are checked;
capacity is reserved before attach, cancellation cleanup remains owner-managed,
and uncertainty prevents lifecycle success. Primary synthetic worker tests: six
passed; broker filter 53 passed; handoff filter 49 passed, 3 ignored (overlap).
Confirmed acquisition explicitly fails closed after a policy-capture review
finding. Events, required lifecycle issuance, send-once provider integration,
durable crash reconciliation and installed verification remain incomplete.
No runtime replacement or prompt. See recovery RUNBOOK for source-bound evidence.

Latest staged checkpoint: handoff BrokerAuthority now compiles against real
original-custody handles. Native registry/daemon concurrent ingress is authenticated
but production acquisition is still unwired. Task writers share a per-session OS
lock; response publication checks expiry/revocation and retains that lock through
delivery. Reload cannot inject script under navigation approval. Primary isolated
tests: broker 43 passed; task_authority 31 passed; handoff 49 passed, 3 ignored
(overlapping filters). Both review blockers were fixed and source-reviewed.
Events intentionally fail closed pending task-aware admission. Exact acquisition,
registry retirement, send-once routing, crash reconciliation, fresh-pipe custody
and provider wiring remain required before install/live verification. No live
browser operation or prompt. Recovery RUNBOOK contains scope and source digests.

Shared-custody checkpoint supersedes the next paragraph's ownership gap: committed
transfer custody now has a worker-owned revocation barrier and opaque weak
handles. Admitted permits retain and verify the original kernel lease plus live
service receipt/binding; close/handoff revoke and drain before mutation. Primary
broker filter: 30 passed; widened handoff filter: 48 passed, 3 ignored (3 tests
overlap). Source-only local review accepted the integration. This advances the
actual ownership prerequisite, not just a mock interface. The production authority
adapter, fresh-pipe counterpart, concurrent ingress, durable crash reconciliation,
provider wiring and safe installed verification still remain. No install/prompt.

Superseding authority checkpoint: native command admission now requires owned
request ID/method/params/task context and a typed async permit carried through
outcome finalization and publication. Exact-session target URL is observed before
admission and after execution; durable duplicate rejection precedes any task
reservation. Primary broker filter: 22 passed. Production integration is blocked
on exposing the worker's real held custody lease/process evidence through a
shared lifecycle revocation/publication barrier. No permissive adapter, fast-lane
dispatch, service action or install was added. Prior fixture passes do not prove
daemon authority or AuraCall integration. See recovery RUNBOOK for review receipt.

2026-09-13 native-core checkpoint: recovery worktree now has internal
broker_attachment.rs and opt-in strict CDP acknowledgment/dispatch-seal checks.
Primary native validation: 44 distinct tests across broker/CDP/inspector filters,
Cargo check, strict Clippy, format check, dev build and diff checks passed. Audit
still reports the same three pre-existing AuraCall violations. Detailed filter
counts and source digests are in the recovery worktree RUNBOOK. No native live
integration is claimed; journal reopen is not complete process-crash recovery.
Dedicated session acquisition, protected identity receipt, durable same-request
replay denial, independent session events and verified sticky detach are staged.
No public action or installed transport selects it. Real daemon custody/task/
profile authority, lifecycle revocation, crash reconciliation, authenticated
concurrent ingress and explicit send-once routing remain acceptance gates before
AuraCall provider wiring. Normal CLI transport retries on connection loss; the
serial worker cannot carry evaluation plus dialog dismissal. Reviewer found and
confirmed fixes for command-cancellation sealing and queued-dispatch sealing.
The prior client checkpoint remains source-only evidence, not installed readiness.

2026-09-13 staged client checkpoint: brokerCdpClient.ts and the shared explicit
connection seam implemented. Primary: 123 tests/eight suites, full typecheck and
build, strict changed-test lint and diff check pass. Package source is excluded
by repository Biome configuration. Audit remains at three existing violations.
Local closed-world source reviewer found no blocking critical regression in the
client slice. Native broker transport, admission/deduplication, provider recovery,
downloads and descendant targets remain unimplemented integration gates. Nothing
installed and no live browser actions or ChatGPT submissions. State remains OPEN.

Local-only transport implementation authorized by the user's latest "ok go"
after the explicit local-review request. No ChatGPT submission is authorized.
The immutable objective remains seamless agent-browser/AuraCall operation,
including uploads, downloads and crash recovery; an adapter-only pass is not
completion. Intake graph: shared client protocol -> native custody admission,
durable deduplication and independent event delivery -> all provider connection
factories/recovery -> artifact and descendant-target migration -> scoped runtime
integration and live no-prompt verification. Preserve installed/main maintenance
and private-renewal behavior rather than merging the recovery branch wholesale.

First implementation packet: add an explicit broker client at the shared
connectToChromeTarget seam. It must never invoke raw Chrome discovery/connection
when selected, must bind command replies/event batches/detach to the immutable
attachment and generation, preserve CRI-style domain/event interfaces, deliver
events independently of pending commands, bound bytes/count/time, never replay
uncertain commands, and make failed detach sticky. Native broker service transport,
capability admission and provider migration remain gates before runtime selection.
Local reviewer /root/broker_transport_contract identified dialog/event concurrency,
separate provider connects, iframe exports and browser-global download settings as
required compatibility work. Stage unsupported paths explicitly, but do not remove
them from the objective or claim seamless operation until migrated and tested.

2026-09-13 endpoint-admission repair: initial and recovery cdp_attach now reconcile
their exact attachment when the returned endpoint cannot be consumed. Cancellation
does not cancel that cleanup. Failed detach retains typed handle/state evidence and
prevents new-tab release. Legacy host/port transport explicitly rejects TLS,
credential-bearing, query/fragment or non-browser capability endpoints rather than
silently stripping their authority. This is not guarded-proxy support; that
transport remains an implementation prerequisite. No live browser input/install.

2026-09-13 01:48 UTC ownership checkpoint (supersedes the diagnostic status
below): installed agent-browser's jobs snapshot has 200 terminal jobs and zero
nonterminal/unknown jobs; retained-browser requirement is verified without
launch. This is not input authority or proof about an image generator's route.
Main/startup source at c284351a lacks controlPlaneAttestation; the candidate
producer exists in agent-browser-recovery-20260910 at b385fd18 plus dirty
fresh-pipe custody changes. It has not been reviewed/integrated into the installed
lineage. Restarting unchanged main cannot fix the missing proof, and legacy
retained records cannot be assumed to have custody. No browser input, replay,
download click, runtime installation or restart was performed in this checkpoint.
Exact DOCX/PDF recovery remains blocked pending verified authority integration.

Latest controller progress: missing downloads now carry response-bound
artifact_transfer_incomplete evidence and route to provider recovery rather
than prose revision. 206 tests pass; actual ee075... re-poll/next-step verified.
Browser worker stopped before clicks because current supported diagnostics
omitted required control-plane attestation. It is diagnosing that omission
read-only; no browser replacement or bypass. Final files remain unrecovered.

2026-09-12 superseding acceptance checkpoint: ee075... is completed and
supervisor1274543 has stopped at document validation. The primary fixed a false
literal-genre check for teaching briefs (205 Python tests pass). Re-polling the
same response then exposed two missing independent downloads. The authoritative
01:44:20 manifest reports three discovered artifacts, but only the ZIP
materialized: response-owned controls `Download DOCX` and `Download PDF` each
failed with `ChatGPT exact artifact control produced no verified browser download.`
This is not undiscovered output or proof that the writer failed to create files.
Both documents are present in the ZIP, but the package cross-check must remain.
Worker `/root/live_recovery_verify` owns one no-launch, exact-response download
recovery cycle; primary inspects generic-label versus exact viewer-name handling.
No prompt replay, API history rewrite, runtime replacement or document release.
Final relevance audit and broader routing/proposal autonomy remain unverified.

Latest: normal collector1266215 completed both fresh HTTP200/no-redirect checks
and document-evidence-ready. Separate source reviewer1274549 exited0, selecting
current reviewed sources and all three new evidence records while excluding
obsolete attempts. Source bundle is now2e55725e3785eb772157257d37949918350aebcf77e59ed31859b28b9e715245.
Normal supervisor1274543 (tool session88326, until-stop,poll15) submitted the
new evidence-continuation resp_ee075325b6e04890a8a7e7914058caec on same6aa4a4bb
conversation. API confirms in_progress/no failure; this is not a replay of177...
or a completed document. Poll that exact existing run/driver; do not duplicate.

Verified outcome_progress at01:30:33UTC: one normal supervisor observation
accepted exact177688... response as document_needs_information. Trusted receipt
observation-27aab560e029cfa179a41a578db269c0b34ad1791b43a2c2775220ac3348c025.json
binds wire3588f865..., original record1dd443... unchanged, exact user/assistant,
fresh account and browser505779. Primary independently checked all five evidence
hashes, requestf9c081be... and both original/source digests. Bridge remains1.
Final installed v2 includes rejection of unsupported >10-attachment bundling;
primary122TS/204Python/fullbuild pass. API1259940 healthyidle, all13record hashes
and full installed/source dist match. Normal evidence collector dispatched
PID1266215 for only two fresh primary URL checks with existing allowlisted
network flags. No new provider prompt has been submitted in this recovery unit.

Current bounded unit: support trusted observation of a typed after-submit
new-project writer without rewriting its failed execution history. Backend
worker live_recovery_verify owns exact runner-wire reconstruction, same-browser
project candidate observation and capability flag/tests. Primary owns existing
controller recovery/supervisor/cache validation and tests. Reviewer
conversation_capacity_detection checks the controller's accepted provenance
boundary. No browser launch, new prompt, final-artifact adoption or manual
receipt trust is authorized by this recovery. Acceptance: fresh installed
observation of177688..., exact information ZIP transition, then normal reviewed
URL-evidence collection. Controller202tests pass; backend/build/install pending.
Automatic discovery/download of uncached artifacts is a separate remaining
autonomy gap, not implied by successful cached-response recovery.

Superseding checkpoint: cleanup fix installed, full dist/13hash parity and
simulated installed-function smoke verified after56tests/fullbuild. API1197594
healthy/idle, browser505779 preserved; rollback pair recorded in journal.
Worker recovered exact assistant ZIP; primary verified991bytes/SHA292bacb5...,
both required digests, two questions and unchanged original API record.
Controller remains document_creation_failed because existing information
recovery requires a response-complete runtime event that this run lacks. Next
unit must preserve fresh exact-response recovery provenance, not synthesize an
old event or force workflow acceptance. No new prompt was submitted.

2026-09-12: writer resp_17768899f98d4f628e02a5c140968038 failed after submit
with typed outcome_unknown; controller is document_creation_failed. No replay
or reconciliation is allowed. Independent retained-browser recovery found
conversation 6aa4a4bb-f028-83ea-a2ec-f8209276f124 and exact full user prompt
after including authoritative runner artifact context. Its assistant requests
the expected two primary-URL checks; ZIP materialization/controller adoption
and final documents remain pending. Original API failure is preserved.
Accepted cleanup defect: outer broker cleanup released task target despite
remote finally preserving it. Narrow source fix preserves uncertain submitted
tabs and typed recovery identity, including detach failure; verification and
paired installed publication are in progress. No broader autonomy claim.

Audited composer migration implemented and locally verified199tests. Independent
review identified missing executed-build provenance; accepted and repaired with
an exact audited response/authoritative-record/installation registry, stored
request correlation and canonical runtime record checks. Other builds/records
are not inferred safe. Closed-world re-review has no remaining blocking findings.
Exact c538c29... reconciliation succeeded without POST; prior broker entry is
unchanged and total2distinct corrections consume the revised bound. One normal
writer continuation is delegated; final evidence exchange/artifacts/audit pending.

Recovery policy revision: the original single pre-submit reconciliation remains
in history. Permit at most two total corrections for distinct proven pre-submit
failure classes, not two attempts per loop or a reset. The new composer class
requires exact failed response/checkpoint, single-attempt local runtime evidence,
the reviewed legacy runtime index hash whose mode check precedes text insertion,
and digest-bound installed repair verification. Require same project/browser,
zero verification prompt submissions and no successful/unknown run evidence.
Repeated classes, further corrections and unknown errors stay blocked. Primary
owns root controller/tests; live_recovery_verify independently verified the
historical source ordering and current repair receipt without browser mutation.

23:57 UTC installed hydration PASS: exact helperSHA
7e60f96707303a5ad9c1a9e4705874ec6c6c56af087944de60d509dce68b0db2 observed
controlsAbsent, waited, then confirmed already-selected Chat on diagnostic
targetB3EDD449D2285854CA0D4CAD60A81974. One reload/helper call, zero clicks or
prompt submissions. Agent live_recovery_verify returned exit0 receipt; primary
read it and rehashed both unchanged failed API records. API1046977 healthyidle;
retained505779 preserved. Controller196tests, route72primaryTS, hydration54TS,
full builds and13installed hashes pass. Next critical path is an evidence-backed
recovery decision for c538c29... without erasing the consumed reconciliation
history, then actual writer evidence/document/audit acceptance. Do not equate
this UI repair with successful provider writing or complete proposal autonomy.

23:52 UTC mode readiness evidence: one diagnostic reload returned document
readyState complete with no composer/modes, then visible composer and selected
Chat about1.1s later. Primary will bound repeated missing-control observations
to5s in ensureChatgptComposerMode. Retry only mode-not-found with zero available
modes; explicit unavailable mode, uncertain selection and malformed responses
still fail. This waits for UI hydration, never retries provider submission.
Live post-fix validation must use the preserved empty diagnostic tab and no
prompt; the existing failed run and consumed reconciliation bound stay intact.

23:49 UTC live route verification: one normal continuation accepted as
resp_c538c29ba453407a934ddfd9cd577df4. Runtime events prove opened_new_tab on
existing browser505779, target4FC728F8A948BDBCF9A337F06777CAFE and exact Workshop
project root. This verifies retained-route execution beyond the old rejection.
The new run failed later: Unable to find the ChatGPT Chat mode control. It has
no final output or bound new conversation. Primary polled terminal failure;
no retry and no reset of the consumed reconciliation bound. Diagnostic retained
tabB3EDD449D2285854CA0D4CAD60A81974 is open on the same project root with an empty
composer. Its hydrated Chat radio is selected, but prompt label differs from
the detector's exact chat-with-ChatGPT label. Timing/layout cause is under
read-only diagnosis; absent output alone is not no-submit proof.

Exact-query diagnosis supersedes the first missing-hints hypothesis: AuraCall
requested only browserHost=remote_headed. Agent-browser defaulted the omitted
display mode to private_virtual_display, while the retained session uses
shared_display; therefore no compatible route hints were issued. The fix must
derive complete posture from unique authoritative retained inventory, request
a fresh matching access plan, and preserve its reuse decision. Merely filling
hints from environment or bypassing a wait decision is not sufficient.
The legacy error is proven pre-dispatch by the native scheduler's Reject branch
before dispatch. Root controller reconciliation now narrowly recognizes its
strict saved envelope; primary passed 196 Python tests including exact-match,
wrong-profile/service/action, contradictory detail/output and history tests.

23:42 UTC bounded continuation: first-writer preparation passed 182 root
controller/supervisor tests and selected eleven reviewed sources. The normal
single POST was accepted as resp_ca76e46d2ef444ccb5f61ae5950d3863, then failed
before writing on broker tab_new duplicate-profile-lane rejection. API acceptance
did not prove browser submission. The original failure remains immutable.
Agent conversation_capacity_detection owns the minimal retained-session route
fix and focused tests; primary owns reconciliation, docs and paired installation;
live_recovery_verify owns independent read-only no-creation evidence. No duplicate
profile override, browser replacement, blind POST retry, or history rewrite.
Acceptance: fresh access-plan browser/session hints reach tab_new, installed
code/record parity with rollback, evidence-bound reconciliation of the exact
pre-submit failure, then one normal writer continuation in the same project.

23:27 UTC: local repair worker920735 finished exit0, added the two exact
reviewed primary links, and used document-source-repair-ready to request a
separate review. Primary inspected both links without treating them as fresh
access verification. Normal source re-review worker926837 dispatched with task
4cbdf9fffd6a233fa694f3a3eebf785925d6a985599011cee28de04ca3de0063.
No writer submission yet. Before continuing into the browser writer, recheck
the destination's usable conversation capacity and preserve same-project/task
continuity; do not blindly submit into a previously exhausted conversation.

23:26 UTC source-review progression: worker915528 completed exit0 and rejected
the candidate's missing explicit primary-paper links through the normal
document-sources-reject transition. Current state document_sources_need_repair.
The brief otherwise met the reviewer's genre/section/word checks; final approval
was not granted. Obsolete evidence attempts and operational diagnostics must be
excluded from selected handoff inputs without deleting their audit files.
Primary inspected the rejection and dispatched the normal local repair worker
PID920735 (task cf93a2f4c92f278dbd6622f6b573aef31a101a5b235970121143570539a62569).
Fresh primary-URL verification remains intentionally downstream in the writer
information-request exchange. No writer request or final document was created.

23:23:20 UTC LIVE NORMAL CONTROLLER PASS: a single supervisor step recovered
resp_55daff582b1344e5b514c442a298fc23 through the installed trusted endpoint.
It accepted the right verdict and advanced to awaiting_document_creation.
The API record remains failed and byte-identical (431cefff66b34c50264219a143ae60fa95f876f90b58de669e7a53cc983be3a4);
controller effective_status=completed and result_recovery preserve the distinction.
Bridge count remains 1 with the original digest and transit time unchanged.
Primary read the resulting candidate and independently checked record/receipt/
candidate digests. Receipt SHA19177fab2dd7a6c11b2879ff20cd87bb82933bddd66980f4ba7d3a5070dc24da;
candidate SHA60a38f8305f6a9e55f86afd058115974bf9fb4f9454733c7bdfa58eb4088c495.
Actual case root: `runtime/handshake-live-tests/full-joined-autonomy-20260911/thoughts/full-joined-autonomy-20260911`
under codex-research. First rejected attempt remains and second is observed.
No prompt replay, manual answer adoption, browser mutation or API history edit.
The normal source-review worker is now dispatched (PID915528, task digest
f43a5904004e041fd994b7d2b8a5dd5744f4708677ff1d78168eebd3237a37c3).
Final writer fresh-URL exchange, DOCX/PDF and relevance acceptance still remain.

23:23 UTC corrective install: idle means no running run/step or active lease;
pending jobs are preserved. Primary scanned all 358 stored records and found
no executing/leased blocker. A concrete background-timer race was also fixed:
timer drain defers during observation, and queued/running drains or reservations
block admission. Busy is typed and the supervisor waits on the same response
without spending the rejected-observation bound. First rejected attempt stays.
Primary passed 177 Python, 88 focused TS and two HTTP tests plus full build and
typecheck. Two-file corrective dist parity and all twelve record hashes passed
before clean API restart (PID908043); browser505779 survived.
Rollback: `/home/bak3r/.auracall/recovery-idle-rollback-20260911-zlo9TF`.
Exactly one normal supervisor recovery step is now running; no downstream prompt.

23:17 UTC first normal recovery step rejected safely before browser readback:
the idle predicate counted two unleased planned/runnable records as active
execution, although API foreground/drain selection was idle. Original failed
record hash and retained browser are unchanged; one rejected controller attempt
is preserved. Fix the execution predicate without deleting/changing old jobs,
using active run/step/lease evidence rather than record age. Do not reset the
three-observation bound or claim the first attempt recovered the result.

23:16 UTC: trusted observation API installed with its broker observation-only
mode and wire-builder exports. Primary independently passed 175 Python tests,
84 focused TypeScript tests, the HTTP auth/body/concurrency regression, complete
typecheck and build. Only three existing compiled files plus the new observation
helper changed. Full installed dist parity and all twelve record hashes pass.
Prior complete dist/record rollback:
`/home/bak3r/.auracall/result-recovery-rollback-20260911-aMnRIb`.
API stopped cleanly to MainPID0 and restarted healthy/idle as PID875576 with
compatibility.recoveryObservation=true. Browser505779 remained intact.
The next test is exactly one normal supervisor step on the original fullcase;
no direct endpoint/manual answer adoption or downstream provider submission.

23:06 UTC next bounded unit: trusted Pro result recovery. Add an authenticated
local response-ID-only observation surface that reconstructs the exact browser
wire prompt from the saved failed run, uses retained broker authority and fresh
account proof, and returns digest-bound readback without changing run history.
No caller-supplied answer/prompt/verified flag, prompt POST, requeue or browser
lifecycle action is permitted. Primary owns Python controller/supervisor;
`/root/conversation_capacity_detection` owns the AuraCall observation/API slice.
The controller must compare saved request correlation and immutable source
digests, preserve original failed status, append recovery provenance, and use
the identical verdict/feedback/synthesis gates as normal completion. Duplicate
recovery is idempotent; the bridge remains exactly one transit. Supervisor may
observe failed Pro once per bound and must not blindly submit another round.
Acceptance requires installed observation, trusted controller transition and
normal continuation of the preserved full-intake case, not manual JSON adoption.

23:03 UTC live PASS: delegated installed snapshot and binder recovered original
user 9aedbdb9-f94e-41a7-9334-2482aa52ec11 and assistant
d0cc4cfc-596a-4eb5-9465-f3ce9c21bdb3 for resp_55daff582b1344e5b514c442a298fc23.
Global generation remained true; its sole marker was proven owned by later
user 23173881-ec5c-416f-8f64-ed5c9d5a4f79. Fresh supported account assertion
matched on retained browser505779/target4C4278BF20BBD5794A62582E9622E7D8.
Primary inspected the receipt and independently rehashed the original record:
431cefff66b34c50264219a143ae60fa95f876f90b58de669e7a53cc983be3a4,
matching both before/after observations. No prompt/browser/history mutation.
Historical account binding remains absent; current proof does not invent it.
Receipt: `runtime/handshake-live-tests/thoughts/full-joined-autonomy-20260911/old-right-installed-binding-20260911-230207.json`
under the codex-research root (private account/answer evidence, not public).
This closes the installed binding defect, not the missing trusted controller
result-recovery transition or the overall autonomous-proposal goal.

23:02 UTC installation checkpoint: primary passed 70 focused tests and full
build. Only recoveryResponseBinding.js differs from the previous dist; the new
hash is b72573a371968f1855ecf0f1b035eb0f039f04bfd805f4981c2335b71fb7abf8.
Full installed dist parity and all ten installation-record hashes pass.
Rollback preserves prior full dist and record at
`/home/bak3r/.auracall/turn-scope-rollback-20260911-IrpwmX`.
Idle API stop reached systemd timeout (status 9); MainPID=0 was verified before
copy. Restarted API PID 815877 is healthy and idle. Browser PID 505779 remained
unchanged. Delegated exact old-response readback is pending; no provider POST.

23:00 UTC bounded recovery slice: the old right-side response has one exact
rendered user match and a following assistant, but a visible status marker in
a later assistant section trips the conversation-global generation check.
Primary tightened the snapshot/binder to accept active status only when every
marker has a unique later user owner beyond the requested answer. Global Stop
controls, missing/ambiguous ownership, selected-turn streaming and legacy
generating snapshots still fail closed. Exact prompt and message identity are
unchanged. Primary passed 34 focused tests and full build; installation and
live readback remain pending. No failed run rewrite or prompt replay is allowed.
The bounded completion criterion is installed exact historical binding; the
separate normal controller recovery transition remains unimplemented.

The normal writer fixture separately completed information-request exchange,
reviewed evidence delivery, all three document downloads, Pro relevance audit
and Codex document review. Its expected upstream-release guard prevents this
writer-only fixture being mistaken for a full bilateral or proposal acceptance.
Current artifact review: https://previews.bwkuehl.com/s/f900d78bd03b.

22:22 UTC superseding checkpoint: installed production artifact retrieval is
verified for existing response `resp_8e3df0f9e6a84131b47f19d568ed304a`.
One materializer call (22:20:13–22:20:58 UTC) passed exact original user/assistant
binding and fresh account proof, discovered three artifacts and materialized
all three canonical names: `final-thought.docx`, `final-thought.pdf`, and
`final-thought-artifacts.zip`. Both standalone files equal their reviewed ZIP
members byte-for-byte; all canonical copies equal their original downloads.
Timestamp/collision original paths and exact-response ownership metadata are
retained. The original API record SHA-256 is unchanged before/after.

Receipt: `/home/bak3r/codex-research/runtime/handshake-live-tests/thoughts/writer-envelope-recovery-20260911/installed-materializer-success-20260911-222013.json`.
The initial immediate preflight failed before materialization; a later installed
snapshot matched exactly, and the authorized continuation reused the same tab.
The broker closed only task target `07B19A0E7AC25F69FA14453BC971B0E2` at
22:21:47 UTC, reporting browser process/session preserved and no browser close.
The pinned original target was not touched. No prompt replay, regeneration,
new browser, or API history rewrite occurred. This proves installed production
materializer recovery, not a fresh normal-runner round trip or full autonomous
proposal acceptance; broader readiness/routing gates remain open.

22:15 UTC: exact timestamp-alias canonicalization is installed. Primary passed
235 adapter/control/download/required-file tests and the full build. Final
adapter SHA-256 is `03df79a53e1926b38a7a70afa9d17bdfcb4f4fbbe484e60859606df04ef50ef4`.
The initial record used an earlier compile's hash; verification caught that
mismatch. It was corrected against the final build, and all ten recorded file
hashes plus full dist parity passed before the live test. API restarted healthy
as PID 621996, with retained browser PID 505779 unchanged. Rollback retains the
prior dist and record in `~/.auracall/timestamp-alias-rollback-20260911-Fi9A1u`.

The rule applies only to an observed valid-calendar timestamp suffix at the
exact artifact-copy boundary. Full case-sensitive stem/extension and existing
message/turn/control URI/ID provenance are required. Original files remain;
exclusive canonical copies must hash identically. Global filename classifiers
and executor required-file checks are unchanged. One fresh production retrieval
of the original response is now pending; no new provider request.

22:10 UTC: post-patch installed recovery passed exact user/assistant binding and
fresh account proof. The production materializer downloaded all three files;
it accepted the ZIP but rejected timestamped standalone names. Primary read
the downloaded DOCX/PDF and independently verified byte equality with their
reviewed ZIP members (DOCX f096fc9c..., PDF b37c1cf2...). No manual download or
provider submission occurred; original API record before/after hashes match.
Receipt: controlled fixture `installed-materializer-result-20260911-220751.json`.

The remaining accepted finding is filename canonicalization for the observed
timestamp alias, not incorrect file selection. Extend only the existing exact
response/control-bound copy boundary, preserve original bytes/names and hashes,
and keep executor filename requirements unchanged. Do not strip timestamp-like
suffixes globally or accept wrong stems/extensions or unbound downloads.

22:07 UTC: rendered-user snapshot repair installed as the only compiled delta,
SHA-256 `2b8c07c62e33f24e2367b32d99838a7314dcd4af778626837d906d551066c22e`.
Primary independently verified 32 recovery tests, full build, complete installed
dist parity and all ten installation-record hashes. Rollback contains the prior
full dist and record at `~/.auracall/rendered-binding-rollback-20260911-Eb5jHR`.
API stop completed before copy, then restarted healthy as PID 583517 with zero
active requests. Browser PID 505779 survived unchanged. One post-patch exact
production materialization attempt is next; no provider request will be sent.

Superseding checkpoint, 22:03 UTC: a separate controller restored the retained
profile as session:chatgpt-pro (PID 505779, remote-headed Chrome 153). Fresh
broker planning allowed one shared client tab for the exact existing document
conversation while preserving pinned target 4C4278BF20BBD5794A62582E9622E7D8.
The installed materializer test reached response binding but not downloads:
the snapshot included attachment labels/toggle text and dropped code markup.
The original API record's before/after SHA-256 remained identical.

Read-only DOM diagnosis proved exact normalized equality of all 19,159 prompt
characters after scoping collapsible-user-message-content and reconstructing
inline CODE and PRE/CODE markers in a detached clone. No expected-prompt
stripping, fuzzy comparison, generation, or page mutation was used. A minimal
deidentified DOM fixture and receipt are preserved under the controlled test
directory. Only the new client tab was released, preserving browser/session and
the original pinned tab. The snapshot extraction repair is the next bounded
change; equality, unique message identity and streaming gates stay unchanged.

Superseding checkpoint, 21:44 UTC: the controlled guide's exact recovered DOCX
and PDF match ZIP members. Saved relevance audit
`resp_c101e781ea21442fb17c5c81ae43b1a9` passed and Codex completed the structured
document review; fixture state is `awaiting_codex_release`. This does not prove
upstream synthesis or normal-runner standalone downloads. Original failed API
records and the explicit manual-recovery provenance remain preserved.

The exact filename/control selector is now installed. Primary independently ran
27 focused tests and the full build; full dist parity and all nine recorded
installed hashes passed. Selector SHA-256 is
`8ec850c87a5c1c152dc591587629710f4f629f4d832d2dc3c1785fe3d8a42c16`.
Rollback is `/home/bak3r/.auracall/exact-control-rollback-20260911-VU949d`, with
the prior complete dist and installation record. API stop completed before copy;
restarted PID 465500 reports healthy, zero active foreground requests.

The subsequent no-launch browser preflight found the retained `default` session
absent and former browser PID 35051 gone. Production materialization did not
start. Browser loss is being diagnosed; no replacement, regeneration, or prompt
replay was attempted. The exact selector is installed but live-unverified.

Broker lifecycle diagnosis: event `event-bf38943e-1eb4-46b1-b6a2-6d06f892d927`
records `unexpected_process_exit` for PID 35051 at 21:41:58.134Z, before the API
stop at 21:42:09Z. Owner daemon 26514 and backend 501 remained alive. This is
actual process loss, not only inventory drift; the underlying crash/kill cause
is unproven. Supported same-profile broker recovery is the next bounded action,
subject to fresh ownership, process/lock, account and exact-response checks.

Primary subsequently reran the wider adapter/control/download suites: all 200
tests passed. Recovery preflight initially omitted `targetServiceId: chatgpt`,
which prevented the existing Linux preference binding from matching. Supplying
that real service identity selects the original installed Linux Chrome build;
no stored preference change is needed. One broker-owned same-profile restore
is authorized under the standing goal, with no prompt submission or replay.

The real SABER evidence contract was also rechecked: structurally valid but
`ready_for_writing=false`, eight unresolved requirements, 18 retrieval jobs,
and a formulation-identity contradiction. This fixture does not close those
scientific, sponsor, citation, exemplar, market or figure-evidence needs.

Terminal recovery checkpoint: the single broker-owned restoration launched PID
479722 at 21:46:48.919Z and reopened the exact existing conversation. Broker
event `event-23c4d399-56ba-4014-9223-f615865d6d95` records that process exiting at
21:47:45.396Z. Primary independently observed the PID absent at 21:48:06Z.
The verification script was created only at 21:48:35.579Z and failed the installed
read-only target-cardinality check before account binding or materialization.
There were zero materializer invocations, downloads or prompt submissions.
No second restoration was attempted. The exit therefore predates the test
script; underlying process termination cause remains unproven. Next bounded
unit is retained-browser lifetime diagnosis, not another blind launch or Pro
submission. Source/download-selector acceptance remains installed but live-open.

Historical checkpoint follows:

Latest checkpoint, 20:57 UTC: response resp_06c88e0377814e239d967f70c0040958
returned the correct information-request ZIP but the API failed strict filename
acceptance because Chrome saved final-thought-artifacts(5).zip. Exact cached
artifact title/control and response-complete runtime evidence linked the intact
ZIP to the new conversation. The real controller recovered it through
document-information-recover, snapshotted all proof files, preserved API failure,
and advanced to document_needs_information with four questions. No prompt replay.

Primary reviewed every question against the immutable objective, refreshed the
local supervisor source evidence and SHA256, passed document-evidence-ready and
then the separate complete document-sources-ready gate. One new evidence-return
request is saved as resp_8e3df0f9e6a84131b47f19d568ed304a on the same new conversation.
It remains in progress; final DOCX/PDF/ZIP and relevance acceptance are pending.

The provider now canonicalizes only proven exact-control browser collision names
into a fresh private directory, preserving the original file and source/copy SHA256.
Executor filename requirements remain strict. Primary verified 34 focused provider
and required-file tests, full build, complete installed parity, and eight recorded
patch hashes. Rollback: /home/bak3r/.auracall/download-collision-rollback-20260911-WhLoUR.
The API was idle before publication; the pending stop job was cancelled by start,
so that command is not represented as successful pre-copy shutdown. Post-update
API PID380833 is healthy/idle and compiled parity is verified. No browser was
replaced. Future updates must await terminal stop before copying, even while idle.

Controller recovery tests: 11 passing, including exact-record rejection and
preserved failed history. This is recovered evidence-exchange progress, not normal
API completion or full autonomous proposal/routing acceptance.

Latest checkpoint, 20:45:54 UTC: the repaired path delivered the unchanged
digest-bound prompt into a fresh same-project conversation
`6aa4685b-20e4-83ea-934d-97e9c72d545c`, target
`878C30C997F3D8E2C955D841BB664DC8`, user
`d4f08075-c0b6-431a-84c3-ba7aa333c9e9`. Browser PID35051/sessiondefault and
the original target remain preserved. `/root/live_recovery_verify` confirmed
active generation read-only; primary accepts this bounded browser evidence.
Saved response `resp_06c88e0377814e239d967f70c0040958` remains in progress.
The actual controller still must accept the returned information ZIP, evidence
exchange and final package. No final document or full autonomy claim is made.

The controller now supports one exact-response, read-only
`document-rollover-reconcile` transition for a proven terminal failure with
`chatgpt_new_conversation_precondition_failed`, phase before, matching project,
request correlation and unchanged reviewed lineage. A repair note is retained;
unknown/active/after-submit failures and repeated reconciliation are rejected.
Primary ran 10 rollover, 89 workflow and 76 supervisor tests successfully.
The exact previous failed request was reconciled without a POST before the
single follow-up above; original and failed response histories are preserved.

The live writer fixture reached the correct retained Workshop conversation, but
its exact assistant turn returned ChatGPT's maximum-conversation-length warning.
No artifact was produced. The API initially kept reporting the original run in
progress after generation stopped. That dead wait is now cancelled with the
capacity evidence preserved. Terminal detection and typed recovery propagation
are installed; same-task fresh-chat continuation is now installed, but the first
live continuation failed its before-submit composer/route check. This
is a provider capacity outcome, not a failed artifact download. The original
response must not be replayed into that conversation.

Evidence: response `resp_125d899a28a44ac29fbbd957f3f45a48`, user message
`23173881-ec5c-416f-8f64-ed5c9d5a4f79`, assistant message
`fcd46939-a202-4fc3-b915-5a1e766fb642`, target
`E67579A9D00DF0FEA5035EA04EB97585`. The browser operator observed the exact
warning at 2026-09-11T20:04:44.242Z and saved a bounded local receipt at
`runtime/handshake-live-tests/thoughts/writer-envelope-recovery-20260911/live-capacity-blocker.json`
in the Codex Research workspace.

## 2026-09-11 implementation checkpoint

The original API wait was explicitly cancelled after the exact provider warning
was confirmed stable. The API recorded terminal cancellation and lease release
at 20:09:50 UTC; the original response and warning remain preserved. Browser
PID 35051 and the original target stayed unchanged.

The provider detector is implemented at the fresh assistant polling seam, with
structured `BrowserAutomationError.details.code` equal to
`chatgpt_conversation_capacity_exhausted`. The runner exposes this through
`failure.details.code`; its generic top-level failure code is not the capacity
classifier. Recovery preserves only this typed capacity exception and retains
the generic no-replay wrapper for other failures.

Primary independently ran 49 passing provider/action tests (one pre-existing
skip) and six passing recovery tests. The worker additionally ran the full
TypeScript check. Full build passed. Planning audit has two pre-existing
canonical-header errors in Plan 0357, not in this plan; they are not represented
as a green repository-wide planning audit.

Three compiled files and their installation-record patch were published after
API quiescence and cgroup separation were verified. Full built/installed `dist`
parity and installation-record hashes passed. Rollback is retained at
`/home/bak3r/.auracall/conversation-capacity-rollback-20260911-qoX99D`.
An installed no-provider fixture preserves the structured exception code.
At 20:13:52-53 UTC the browser operator evaluated the installed predicate via
the retained broker: the exact warning assistant returned true, the original
user message returned false, and browser/target continuity passed. Primary
accepts this bounded delegated readback. It does not prove a new normal runner
terminates correctly or that same-project continuation works. No new chat or
submission has occurred.

## Objective and scope

### 20:39 UTC installed rollover checkpoint

Primary installed explicit same-project creation and the typed `/status`
compatibility flag after API quiescence and retained browser separation checks.
Only five compiled files differed; full built/installed parity and all seven
recorded patch hashes passed. Rollback and prior installation record remain at
`/home/bak3r/.auracall/conversation-rollover-rollback-20260911-XsJfRZ`.
The API advertises `supportsChatgptNewConversationProjectId: true`. The controller
requires strict true before retry-state changes or POST, preventing old schemas
from silently stripping the new field and targeting the full conversation.

Primary verified 8 rollover, 76 supervisor, 89 document-workflow, and 16 focused
browser/runtime tests plus full build. Worker `/root/conversation_capacity_detection`
reported the targeted HTTP status test and full type check passed; primary
reviewed its three-file capability diff. Worker `/root/live_recovery_verify`
confirmed exact original target, warning, stopped generation and cancelled old
response at 20:36:41 UTC without navigation or submission.

The controller prepared a digest-bound capacity review and accepted one new API
request: `resp_19c3ea2011914cdaaa024df85a158dc8`. That request failed with
`chatgpt_new_conversation_precondition_failed`, phase `before`, retryable false.
No browser-run summary or final files were returned. The creation marker remains
submitted and blocks replay pending exact outcome reconciliation. Original
cancelled response and reviewed source lineage remain unchanged in history.
Read-only diagnosis must identify the actual route/composer failure before any
new attempt. This checkpoint is installed blocker reduction, not successful
live rollover, document completion, or full proposal/routing autonomy.

Read-only diagnosis: the API process environment pins the old conversation in
`AURACALL_AGENT_BROWSER_URL_CHATGPT`. `resolveAgentBrowserBrokerUrl` protects
explicit conversation URLs but not project roots; `index.ts` then substitutes
that returned old URL into brokerConfig. The retained target readback also shows
the original conversation and a ready empty composer. Narrow remedy: explicit
new-mode project root must outrank this ambient URL setting, while ordinary
requests retain existing precedence. Keep the exact-root guard. Before any
second request, reconcile the exact terminal before-submit failure and preserve
both response histories; an unknown or after-submit failure remains non-retryable.

20:42 UTC: narrow precedence fix installed after idle API-only stop. Primary ran
28 browser-mode tests and full build, then verified the only compiled delta was
browser/index.js. Complete dist parity, seven installation-record hashes, API
capability/idle health, and an installed no-provider old-URL override regression
passed. Rollback: `/home/bak3r/.auracall/rollover-route-rollback-20260911-7pgMwG`.
Worker additionally reported 40 focused tests and full type check passed. No
second live request sent. Next: implement bounded, exact-correlation reconciliation
for a terminal proven before-submit failure; do not reset history or replay an
unknown/after-submit creation. Then resume live information-request acceptance.

Recognize a fresh provider conversation-capacity failure, expose its specific
reason without waiting for a generic answer timeout, and support a bounded
same-task continuation in a verified fresh conversation of the same project.
The initiating prompt, reviewed source lineage, failed response identity, and
task history must survive continuation. This is part of the existing autonomous
workflow goal, not a new project or tenant scope.

## Work units and ownership

1. `/root/conversation_capacity_detection`: provider-specific detection and
   focused tests. Distinguish the current assistant warning from historical or
   user-quoted text. No installation, browser mutation, commit, or publication.
2. Primary: controller recovery contract, source integration, docs, regression
   review, and quiescent installed verification. Owns final acceptance.
3. `/root/live_recovery_verify`: poll the original response and preserve exact
   browser evidence. No replay or new conversation before controller readiness.
4. Serialized integration: prove the old run terminal, verify current broker
   authority, create at most one same-project replacement chat through the
   retained browser, verify its returned identity, and resume with reviewed
   context. An uncertain creation/submission requires reconciliation, not retry.

Each code unit has at most two implementation attempts and one closed-world
regression review. A failing bound triggers local replan, not silent replay.

## Non-goals

- No browser/profile replacement, lease stealing, or account changes.
- No automatic project creation or unrelated destination selection in this slice.
- No treating a capacity warning as a finished document or rewriting the original
  failed API response as successful.
- No accepting old or same-named files from another assistant turn.
- No claim that this bounded recovery proves full proposal quality or routing.

## Acceptance criteria

- [ ] Fresh exact-turn capacity warning yields a specific terminal failure.
- [ ] Historical warnings and user quotations do not terminate a valid response.
- [ ] Detection never triggers a correction prompt, regeneration, or implicit chat creation.
- [ ] Controller preserves the failed attempt and exact original prompt/source lineage.
- [ ] Fresh conversation is created once in the same verified project using the
      existing broker-owned browser; unknown outcomes fail closed without replay.
- [ ] Installed behavior matches reviewed source and retains rollback evidence.
- [ ] The preserved live fixture advances through genuine missing-evidence
      retrieval and review, then verifies the returned final artifact set.

## Definition of done

### Exact artifact-control remediation (source verified, live pending)

The standalone DOCX failure exposed a concrete selector defect: a stem-prefix
match admitted `final-thought-artifacts.zip` for `final-thought.docx` at an old
button ordinal. Control selection now requires the full normalized filename,
including its extension, within the specified stable turn/message ownership.
The unique exact match may survive reordered buttons; multiple matches fail
closed rather than using position or first-match selection. Without stable
ownership, the existing ordinal constraint remains. Downloaded filename and
byte checks remain unchanged. Timestamp-suffixed PDF names are not normalized
by this repair; their provenance is still a separate investigation.

All criteria above are verified against current source, installed runtime, and
the actual retained-browser workflow. Local tests alone do not close this plan.

### 2026-09-19 connection-loss preservation repair (source verified)

Required fresh-project remote connection loss is now classified as
`chatgpt_new_conversation_outcome_unknown` with exact project identity,
`phase: after`, `retryable: false`, and `stage: connection-lost`. This enters
the existing broker cleanup path that detaches transport but suppresses release
of the exact retained target, carrying its broker recovery identity forward for
read-only reconciliation. Ordinary remote connection loss remains generic.

Focused regression evidence: 196 assertions across browser exports, broker
cleanup, and failed-response observation. The cleanup regression proves one
detach and no tab release for the typed connection-loss outcome. This does not
retroactively recover the prior closed target and does not authorize a retry or
another live prompt. Deployment is blocked: the active user-runtime checkout is
on a divergent implementation that lacks this fresh-project contract and its
target-preserving cleanup seam. Reconcile the runtime lane before installation;
do not hand-port this classification onto a generic remote-loss path.
