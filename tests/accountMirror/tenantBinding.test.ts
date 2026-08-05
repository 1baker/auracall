import { describe, expect, test } from "vitest";
import {
	accountMirrorIdentityKeysMatch,
	accountMirrorIdentityKeysMismatch,
	createAccountMirrorBindingKey,
	createAccountMirrorTenantKey,
	normalizeAccountMirrorProviderIdentityKey,
} from "../../src/accountMirror/tenantBinding.js";

describe("account mirror tenant binding keys", () => {
	test("derives tenant keys from provider and normalized bound identity", () => {
		expect(
			createAccountMirrorTenantKey({
				provider: "gemini",
				boundIdentityKey: " Operator@Example.COM ",
			}),
		).toBe("service-account:gemini:operator@example.com");
		expect(
			createAccountMirrorTenantKey({
				provider: "chatgpt",
				boundIdentityKey: null,
			}),
		).toBeNull();
	});

	test("derives binding keys from provider runtime profile and browser profile", () => {
		expect(
			createAccountMirrorBindingKey({
				provider: "gemini",
				runtimeProfileId: "eco-gemini",
				browserProfileId: "stealth-rdp",
			}),
		).toBe("binding:gemini:eco-gemini:stealth-rdp");
	});

	test("preserves qualified Business tenant keys while comparing their provider email", () => {
		const businessKey =
			"service-account:chatgpt:operator@example.com|plan=team|structure=workspace";

		expect(
			createAccountMirrorTenantKey({
				provider: "chatgpt",
				boundIdentityKey: businessKey,
			}),
		).toBe(businessKey);
		expect(
			accountMirrorIdentityKeysMismatch({
				provider: "chatgpt",
				expectedIdentityKey: businessKey,
				detectedIdentityKey: "operator@example.com",
			}),
		).toBe(false);
		expect(
			accountMirrorIdentityKeysMismatch({
				provider: "chatgpt",
				expectedIdentityKey: businessKey,
				detectedIdentityKey: "other@example.com",
			}),
		).toBe(true);
	});

	test("matches equivalent provider identities while rejecting absent or incomparable evidence", () => {
		const compositeIdentity =
			"service-account:chatgpt:operator@example.com|plan=plus|structure=personal";

		expect(
			accountMirrorIdentityKeysMatch({
				provider: "chatgpt",
				expectedIdentityKey: " Operator@Example.COM ",
				detectedIdentityKey: compositeIdentity,
			}),
		).toBe(true);
		expect(
			accountMirrorIdentityKeysMatch({
				provider: "chatgpt",
				expectedIdentityKey: "operator@example.com",
				detectedIdentityKey: "other@example.com",
			}),
		).toBe(false);
		expect(
			accountMirrorIdentityKeysMatch({
				provider: "chatgpt",
				expectedIdentityKey: "operator@example.com",
				detectedIdentityKey: null,
			}),
		).toBe(false);
		expect(
			accountMirrorIdentityKeysMatch({
				provider: "chatgpt",
				expectedIdentityKey: "operator@example.com",
				detectedIdentityKey: "service-account:chatgpt:|plan=plus",
			}),
		).toBe(false);
		expect(
			accountMirrorIdentityKeysMatch({
				provider: "grok",
				expectedIdentityKey: "operator@example.com",
				detectedIdentityKey: "@operator",
			}),
		).toBe(false);
	});

	test("keeps provider-specific identity normalization on the shared path", () => {
		expect(normalizeAccountMirrorProviderIdentityKey("grok", " @Valid_123 ")).toBe("@valid_123");
		expect(normalizeAccountMirrorProviderIdentityKey("grok", "@not-valid-handle")).toBeNull();
	});
});
