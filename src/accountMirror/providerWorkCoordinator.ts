import type { AccountMirrorProvider } from "./politePolicy.js";

export interface AccountMirrorProviderWorkLease {
	provider: AccountMirrorProvider;
	ownerId: string;
	release(): void;
}

export interface AccountMirrorProviderWorkAcquireRequest {
	provider: AccountMirrorProvider;
	ownerId: string;
	isEligible?: () => boolean;
	onWait?: (activeOwnerId: string | null) => void;
}

export interface AccountMirrorProviderWorkCoordinator {
	acquire(
		request: AccountMirrorProviderWorkAcquireRequest,
	): Promise<AccountMirrorProviderWorkLease | null>;
	cancel(ownerId: string): void;
	currentOwner(provider: AccountMirrorProvider): string | null;
}

type ProviderWorkOwner = {
	ownerId: string;
	lease: AccountMirrorProviderWorkLease;
};

type ProviderWorkWaiter = {
	request: AccountMirrorProviderWorkAcquireRequest;
	resolve: (lease: AccountMirrorProviderWorkLease | null) => void;
};

export function createAccountMirrorProviderWorkCoordinator(): AccountMirrorProviderWorkCoordinator {
	const owners = new Map<AccountMirrorProvider, ProviderWorkOwner>();
	const waiters = new Map<AccountMirrorProvider, ProviderWorkWaiter[]>();

	const grantNext = (provider: AccountMirrorProvider) => {
		const queue = waiters.get(provider) ?? [];
		while (queue.length > 0) {
			const waiter = queue.shift();
			if (!waiter) break;
			if (waiter.request.isEligible && !waiter.request.isEligible()) {
				waiter.resolve(null);
				continue;
			}
			const lease = createLease(provider, waiter.request.ownerId);
			owners.set(provider, {
				ownerId: waiter.request.ownerId,
				lease,
			});
			waiter.resolve(lease);
			break;
		}
		if (queue.length > 0) {
			waiters.set(provider, queue);
		} else {
			waiters.delete(provider);
		}
	};

	const createLease = (
		provider: AccountMirrorProvider,
		ownerId: string,
	): AccountMirrorProviderWorkLease => {
		let released = false;
		return {
			provider,
			ownerId,
			release() {
				if (released) return;
				released = true;
				if (owners.get(provider)?.ownerId !== ownerId) return;
				owners.delete(provider);
				grantNext(provider);
			},
		};
	};

	return {
		async acquire(request) {
			const active = owners.get(request.provider);
			if (active?.ownerId === request.ownerId) return active.lease;
			if (!active) {
				if (request.isEligible && !request.isEligible()) return null;
				const lease = createLease(request.provider, request.ownerId);
				owners.set(request.provider, {
					ownerId: request.ownerId,
					lease,
				});
				return lease;
			}
			request.onWait?.(active.ownerId);
			return await new Promise<AccountMirrorProviderWorkLease | null>((resolve) => {
				const queue = waiters.get(request.provider) ?? [];
				queue.push({ request, resolve });
				waiters.set(request.provider, queue);
			});
		},
		cancel(ownerId) {
			for (const [provider, queue] of waiters) {
				const retained: ProviderWorkWaiter[] = [];
				for (const waiter of queue) {
					if (waiter.request.ownerId === ownerId) {
						waiter.resolve(null);
					} else {
						retained.push(waiter);
					}
				}
				if (retained.length > 0) {
					waiters.set(provider, retained);
				} else {
					waiters.delete(provider);
				}
			}
		},
		currentOwner(provider) {
			return owners.get(provider)?.ownerId ?? null;
		},
	};
}
