import { createHash, randomBytes } from "node:crypto";

export const DASHBOARD_SESSION_COOKIE_NAME = "__Host-auracall-dashboard";
export const DASHBOARD_SESSION_TTL_MS = 15 * 60 * 1000;

export interface DashboardSession<TPrincipal> {
	principal: TPrincipal;
	expiresAt: string;
}

export interface CreatedDashboardSession<TPrincipal> extends DashboardSession<TPrincipal> {
	token: string;
}

export interface DashboardSessionStore<TPrincipal> {
	create(principal: TPrincipal): CreatedDashboardSession<TPrincipal>;
	read(token: string | null): DashboardSession<TPrincipal> | null;
	revoke(token: string | null): boolean;
	clear(): void;
}

export function createDashboardSessionStore<TPrincipal>(
	input: { now?: () => Date; ttlMs?: number; createToken?: () => string } = {},
): DashboardSessionStore<TPrincipal> {
	const now = input.now ?? (() => new Date());
	const ttlMs = input.ttlMs ?? DASHBOARD_SESSION_TTL_MS;
	const createToken = input.createToken ?? (() => randomBytes(32).toString("base64url"));
	if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0) {
		throw new Error("Dashboard session ttlMs must be a positive safe integer.");
	}
	const sessions = new Map<
		string,
		{
			principal: TPrincipal;
			expiresAtMs: number;
		}
	>();

	const pruneExpired = (nowMs: number): void => {
		for (const [digest, session] of sessions) {
			if (session.expiresAtMs <= nowMs) sessions.delete(digest);
		}
	};

	return {
		create(principal) {
			const nowMs = now().getTime();
			pruneExpired(nowMs);
			const token = createToken();
			if (!isDashboardSessionToken(token)) {
				throw new Error("Dashboard session token generator returned an invalid token.");
			}
			const expiresAtMs = nowMs + ttlMs;
			sessions.set(digestDashboardSessionToken(token), { principal, expiresAtMs });
			return {
				principal,
				token,
				expiresAt: new Date(expiresAtMs).toISOString(),
			};
		},
		read(token) {
			if (!isDashboardSessionToken(token)) return null;
			const nowMs = now().getTime();
			pruneExpired(nowMs);
			const session = sessions.get(digestDashboardSessionToken(token));
			if (!session) return null;
			return {
				principal: session.principal,
				expiresAt: new Date(session.expiresAtMs).toISOString(),
			};
		},
		revoke(token) {
			if (!isDashboardSessionToken(token)) return false;
			return sessions.delete(digestDashboardSessionToken(token));
		},
		clear() {
			sessions.clear();
		},
	};
}

export function readDashboardSessionCookie(value: string | undefined): string | null {
	if (!value) return null;
	const matches = value
		.split(";")
		.map((entry) => entry.trim())
		.filter((entry) => entry.startsWith(`${DASHBOARD_SESSION_COOKIE_NAME}=`))
		.map((entry) => entry.slice(DASHBOARD_SESSION_COOKIE_NAME.length + 1));
	if (matches.length !== 1) return null;
	return isDashboardSessionToken(matches[0]) ? matches[0] : null;
}

export function createDashboardSessionCookie(
	token: string,
	ttlMs = DASHBOARD_SESSION_TTL_MS,
): string {
	if (!isDashboardSessionToken(token)) throw new Error("Dashboard session token is invalid.");
	const maxAgeSeconds = Math.max(1, Math.floor(ttlMs / 1000));
	return `${DASHBOARD_SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${String(maxAgeSeconds)}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearDashboardSessionCookie(): string {
	return `${DASHBOARD_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function isDashboardSessionToken(value: string | null | undefined): value is string {
	return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/u.test(value);
}

function digestDashboardSessionToken(token: string): string {
	return createHash("sha256").update(token).digest("base64url");
}
