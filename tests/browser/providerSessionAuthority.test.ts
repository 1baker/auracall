import { describe, expect, test } from "vitest";
import {
	createProviderSessionAuthorization,
	createProviderSessionAuthority,
	summarizeProviderSessionAuthorization,
} from "../../src/browser/providers/providerSessionAuthority.js";

describe("provider session authority", () => {
	test("constructs canonical authorization from configured account identity and execution context", () => {
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "default",
			managedBrowserProfile: "/tmp/managed/chatgpt",
			browserProcessId: null,
			browserTargetId: null,
		};
		const authorization = createProviderSessionAuthorization(
			{
				profiles: {
					default: {
						services: { chatgpt: { identity: { email: "operator@example.com" } } },
					},
				},
			},
			context,
		);

		expect(authorization.context).toEqual(context);
		expect(authorization.expectation).toMatchObject({
			providerId: "chatgpt",
			configuredIdentity: { email: "operator@example.com" },
			source: "runtime-profile",
		});
	});

	test("summarizes authorization without exposing configured account identity", () => {
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "default",
			managedBrowserProfile: "/tmp/managed/chatgpt",
			browserProcessId: null,
			browserTargetId: null,
		};
		const authorization = createProviderSessionAuthorization(
			{
				profiles: {
					default: {
						services: { chatgpt: { identity: { email: "operator@example.com" } } },
					},
				},
			},
			context,
		);

		const serialized = JSON.stringify(summarizeProviderSessionAuthorization(authorization));
		expect(serialized).toContain('"providerId":"chatgpt"');
		expect(serialized).toContain('"configuredIdentityPresent":true');
		expect(serialized).not.toContain("operator@example.com");
		expect(serialized).not.toContain("service-account:chatgpt");
	});

	test("authorizes the same configured provider account across different managed browser profiles", () => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: { identity: { email: "operator@example.com" } },
					},
				},
			},
		});
		const firstContext = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-1",
			managedBrowserProfile: "/tmp/managed/one",
			browserProcessId: 101,
			browserTargetId: "target-one",
		};
		const secondContext = {
			...firstContext,
			browserProfile: "wsl-chrome-2",
			managedBrowserProfile: "/tmp/managed/two",
			browserProcessId: 202,
			browserTargetId: "target-two",
		};
		const expectation = authority.resolveExpectation(firstContext);

		expect(authority.verify({
			context: firstContext,
			expectation,
			observation: { email: "operator@example.com", source: "auth-session" },
		}).verdict).toBe("match");
		expect(authority.verify({
			context: secondContext,
			expectation,
			observation: { email: "operator@example.com", source: "auth-session" },
		}).verdict).toBe("match");
	});

	test("rejects a different provider account inside the same managed browser profile with dimension evidence", () => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: { identity: { email: "expected@example.com" } },
					},
				},
			},
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-3",
			managedBrowserProfile: "/tmp/managed/shared",
			browserProcessId: 303,
			browserTargetId: "target-shared",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { email: "actual@example.com", source: "auth-session" },
		});

		expect(proof.verdict).toBe("conflict");
		expect(proof.dimensions).toContainEqual({
			dimension: "email",
			state: "conflict",
			expected: "expected@example.com",
			observed: "actual@example.com",
			expectationSource: "runtime-profile",
			observationSource: "auth-session",
		});
	});

	test("treats absent qualifier evidence as unknown after primary account match", () => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: {
							identity: {
								email: "operator@example.com",
								accountPlanType: "team",
								accountStructure: "workspace",
							},
						},
					},
				},
			},
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-3",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: 303,
			browserTargetId: "target-default",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { email: "operator@example.com", source: "provider-app" },
		});

		expect(proof.verdict).toBe("match");
		expect(proof.dimensions).toEqual(expect.arrayContaining([
			expect.objectContaining({ dimension: "email", state: "match" }),
			expect.objectContaining({ dimension: "plan", state: "unknown" }),
			expect.objectContaining({ dimension: "structure", state: "unknown" }),
		]));
	});

	test("does not treat a mutable provider display name as authorization evidence", () => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: {
							identity: { email: "operator@example.com", name: "Configured Label" },
						},
					},
				},
			},
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-3",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: 303,
			browserTargetId: "target-default",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: {
				email: "operator@example.com",
				name: "Live Provider Display Name",
				source: "chatgpt-auth-session",
			},
		});

		expect(proof.verdict).toBe("match");
		expect(proof.dimensions).not.toContainEqual(expect.objectContaining({ dimension: "name" }));
	});

	test("normalizes captured ChatGPT team workspace vocabulary to Business account level", () => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: {
							identity: { email: "operator@example.com", accountLevel: "Business" },
						},
					},
				},
			},
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-3",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: 303,
			browserTargetId: "target-default",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: {
				email: "operator@example.com",
				accountPlanType: "team",
				accountStructure: "workspace",
				source: "auth-session",
			},
		});

		expect(proof.verdict).toBe("match");
		expect(proof.dimensions).toContainEqual(expect.objectContaining({
			dimension: "account-level",
			state: "match",
			observed: "business",
		}));
	});

	test.each([
		["email", { email: "other@example.com" }],
		["account-id", { email: "operator@example.com", accountId: "acct_other" }],
		["organization", { email: "operator@example.com", organizationId: "org_other" }],
		["plan", { email: "operator@example.com", accountPlanType: "pro" }],
		["structure", { email: "operator@example.com", accountStructure: "personal" }],
	] as const)("fails closed on an explicit %s conflict", (dimension, observation) => {
		const authority = createProviderSessionAuthority({
			profiles: {
				default: {
					services: {
						chatgpt: {
							identity: {
								email: "operator@example.com",
								accountId: "acct_expected",
								organizationId: "org_expected",
								accountPlanType: "team",
								accountStructure: "workspace",
							},
						},
					},
				},
			},
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "wsl-chrome-3",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: 303,
			browserTargetId: "target-default",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { ...observation, source: "auth-session" },
		});

		expect(proof.verdict).toBe("conflict");
		expect(proof.dimensions).toContainEqual(expect.objectContaining({ dimension, state: "conflict" }));
	});

	test("invalidates a prior proof after browser process or target replacement", () => {
		const authority = createProviderSessionAuthority({
			services: { chatgpt: { identity: { email: "operator@example.com" } } },
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: null,
			browserProfile: "default",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: 303,
			browserTargetId: "target-one",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { email: "operator@example.com", source: "auth-session" },
		});

		expect(authority.validateProof(context, proof).verdict).toBe("match");
		expect(authority.validateProof({ ...context, browserProcessId: 404 }, proof).verdict).toBe("stale");
		expect(authority.validateProof({ ...context, browserTargetId: "target-two" }, proof).verdict).toBe("stale");
	});

	test("does not treat browser-profile equality as configured provider-account authority", () => {
		const authority = createProviderSessionAuthority({});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "operator@example.com",
			sourceBrowserProfile: "operator@example.com",
			managedBrowserProfile: "/tmp/managed/operator@example.com",
			browserProcessId: 303,
			browserTargetId: "target-one",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { email: "operator@example.com", source: "auth-session" },
		});

		expect(proof.verdict).toBe("missing");
		expect(proof.failureReason).toBe("provider_session_expectation_missing");
		expect(proof.expectation.configuredIdentity).toBeNull();
	});

	test("fails closed when concrete browser process or target provenance is missing", () => {
		const authority = createProviderSessionAuthority({
			services: { chatgpt: { identity: { email: "operator@example.com" } } },
		});
		const context = {
			providerId: "chatgpt" as const,
			auracallRuntimeProfile: "default",
			browserProfile: "default",
			managedBrowserProfile: "/tmp/managed/default",
			browserProcessId: null,
			browserTargetId: "target-one",
		};
		const proof = authority.verify({
			context,
			expectation: authority.resolveExpectation(context),
			observation: { email: "operator@example.com", source: "auth-session" },
		});

		expect(proof.verdict).toBe("missing");
		expect(proof.failureReason).toBe("provider_session_provenance_missing");
	});
});
