# Issue 8 Chat-mode Skill limitation | 2026-09-23

The operator confirmed that ChatGPT Chat does not expose user-added Skills for
selection. This corroborates the retained Plan 0336 evidence: AuraCall and the
native Try-in-chat flow serialized the exact custom Skill ID, but the responding
model could not access its Skill resource. Prompt text or serialization is not
execution proof.

AuraCall now treats user-added Skill execution in Chat mode as unsupported:

- `skills run` rejects before inventory reads, browser launch, or Send;
- both exported execution paths enforce the same negative contract;
- Skill list/show/select and exact-ID CRUD remain available;
- Work-mode execution testing is explicitly deferred.

Provider-free validation consists of two sequential RED/GREEN contracts in
`tests/cli/chatgptSkillsCommand.test.ts`, plus the focused file and TypeScript
checks. The three-file affected packet passes 29/29; typecheck, production
build, scoped Biome, and diff checks pass. The repository-wide plan audit is
currently blocked by 32 missing policy targets referenced from `AGENTS.md` by
the pre-existing main commit `2b08d5f2e`; this Issue 8 diff does not touch
`AGENTS.md` or those policy paths. No browser, provider prompt, installation,
scheduler mutation, or live retry was performed.

Disposition: close issue 8 as a stable, attributable Chat-mode provider
limitation with an AuraCall pre-effect guard. Work mode remains outside scope.
