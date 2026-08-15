import { describe, expect, it } from "vitest";
import {
	clearDashboardSessionCookie,
	createDashboardSessionCookie,
	createDashboardSessionStore,
	DASHBOARD_SESSION_COOKIE_NAME,
	DASHBOARD_SESSION_TTL_MS,
	readDashboardSessionCookie,
} from "../src/http/dashboardSession.js";

describe("dashboard session storage", () => {
	it("creates opaque absolute-expiry sessions without retaining plaintext tokens as keys", () => {
		let now = new Date("2026-08-15T12:00:00.000Z");
		const token = "A".repeat(43);
		const principal = { id: "operator" };
		const sessions = createDashboardSessionStore({
			now: () => now,
			createToken: () => token,
		});

		const created = sessions.create(principal);
		expect(created).toEqual({
			principal,
			token,
			expiresAt: "2026-08-15T12:15:00.000Z",
		});
		expect(sessions.read(token)).toEqual({
			principal,
			expiresAt: "2026-08-15T12:15:00.000Z",
		});

		now = new Date("2026-08-15T12:14:59.999Z");
		expect(sessions.read(token)?.principal).toBe(principal);
		now = new Date("2026-08-15T12:15:00.000Z");
		expect(sessions.read(token)).toBeNull();
	});

	it("revokes, clears, and rejects malformed or unknown tokens", () => {
		const tokens = ["B".repeat(43), "C".repeat(43)];
		const sessions = createDashboardSessionStore({
			createToken: () => tokens.shift() ?? "D".repeat(43),
		});
		const first = sessions.create({ id: "first" });
		const second = sessions.create({ id: "second" });

		expect(sessions.read("not-a-session-token")).toBeNull();
		expect(sessions.read("Z".repeat(43))).toBeNull();
		expect(sessions.revoke(first.token)).toBe(true);
		expect(sessions.revoke(first.token)).toBe(false);
		expect(sessions.read(second.token)).not.toBeNull();
		sessions.clear();
		expect(sessions.read(second.token)).toBeNull();
	});

	it("requires positive bounded expiry and valid generated tokens", () => {
		expect(() => createDashboardSessionStore({ ttlMs: 0 })).toThrow(/positive safe integer/u);
		expect(() => createDashboardSessionStore({ ttlMs: Number.MAX_VALUE })).toThrow(
			/positive safe integer/u,
		);
		expect(() =>
			createDashboardSessionStore({ createToken: () => "short" }).create({ id: "operator" }),
		).toThrow(/invalid token/u);
	});
});

describe("dashboard session cookie contract", () => {
	it("serializes one host-only secure HttpOnly strict cookie", () => {
		const token = "E".repeat(43);
		expect(createDashboardSessionCookie(token)).toBe(
			`${DASHBOARD_SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${String(DASHBOARD_SESSION_TTL_MS / 1000)}; HttpOnly; Secure; SameSite=Strict`,
		);
		expect(clearDashboardSessionCookie()).toBe(
			`${DASHBOARD_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
		);
	});

	it("reads exactly one valid cookie and rejects ambiguity", () => {
		const token = "F".repeat(43);
		expect(
			readDashboardSessionCookie(`theme=dark; ${DASHBOARD_SESSION_COOKIE_NAME}=${token}`),
		).toBe(token);
		expect(
			readDashboardSessionCookie(
				`${DASHBOARD_SESSION_COOKIE_NAME}=${token}; ${DASHBOARD_SESSION_COOKIE_NAME}=${"G".repeat(43)}`,
			),
		).toBeNull();
		expect(readDashboardSessionCookie(`${DASHBOARD_SESSION_COOKIE_NAME}=short`)).toBeNull();
		expect(readDashboardSessionCookie(undefined)).toBeNull();
	});
});
