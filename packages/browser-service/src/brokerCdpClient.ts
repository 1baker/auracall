import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import type { ChromeClient } from './types.js';

export type BrokerCdpBinding = Readonly<{
  attachmentId: string;
  browserId: string;
  profileId: string;
  sessionName: string;
  targetId: string;
  generation: string;
}>;

type BoundRequest = { binding: BrokerCdpBinding; requestId: string };
export type BrokerCdpReply = BoundRequest & { result?: unknown; error?: { code: number; message: string } };
export type BrokerCdpEventBatch = BoundRequest & {
  cursor: number;
  overflow: boolean;
  events: Array<{ sequence: number; method: string; params: unknown }>;
};

/** Implemented by the broker, never by a raw Chrome endpoint. Admission and
 * result delivery both require current custody/privacy checks on the broker.
 * Event reads must not queue behind an in-flight command (dialogs need them).
 * requestId is durable deduplication identity, not permission to retry a timeout.
 * A native connector must obtain taskContext for each command request. Event
 * polling is passive, exact-session filtered, and authorized by the acquired
 * attachment; an empty poll does not grant or renew task authority.
 */
export interface BrokerCdpTransport {
  command(request: BoundRequest & { method: string; params: Record<string, unknown> }, signal: AbortSignal): Promise<BrokerCdpReply>;
  events(request: BoundRequest & { cursor: number }, signal: AbortSignal): Promise<BrokerCdpEventBatch>;
  detach(request: BoundRequest, signal: AbortSignal): Promise<BoundRequest & { detached: boolean; browserPreserved: boolean }>;
}

export type BrokerCdpConnection = {
  binding: BrokerCdpBinding;
  transport: BrokerCdpTransport;
  /** Observes a fully validated event before provider listeners can issue the
   * next command. It cannot change the immutable broker binding. */
  onEvent?: (event: { method: string; params: unknown }) => void;
  commandTimeoutMs?: number;
  pollTimeoutMs?: number;
  detachTimeoutMs?: number;
};

/** Owns an acquired attachment before provider admission or event polling. */
export type BrokerCdpSession = {
  readonly binding: BrokerCdpBinding;
  connect(options?: { abortSignal?: AbortSignal }): ChromeClient;
  close(): Promise<void>;
};

// These are client compatibility limits, not a substitute for native admission.
const METHODS = new Set([
  'Runtime.enable', 'Runtime.disable', 'Runtime.evaluate', 'Runtime.callFunctionOn',
  'Runtime.getProperties', 'Runtime.releaseObject', 'Runtime.releaseObjectGroup',
  'Page.enable', 'Page.disable', 'Page.navigate', 'Page.reload', 'Page.bringToFront',
  'Page.captureScreenshot', 'Page.handleJavaScriptDialog', 'Page.getFrameTree',
  'DOM.enable', 'DOM.disable', 'DOM.getDocument', 'DOM.querySelector', 'DOM.querySelectorAll',
  'DOM.describeNode', 'DOM.resolveNode', 'DOM.setFileInputFiles',
  'Input.insertText', 'Input.dispatchKeyEvent', 'Input.dispatchMouseEvent',
  'Network.enable', 'Network.disable', 'Network.getResponseBody',
]);
const EVENTS = new Set([
  'Page.javascriptDialogOpening', 'Page.javascriptDialogClosed', 'Page.loadEventFired',
  'Page.domContentEventFired', 'Page.frameNavigated', 'Page.frameDetached',
  'Network.responseReceived', 'Network.loadingFinished', 'Network.loadingFailed',
  'Network.requestWillBeSent', 'Runtime.executionContextCreated',
  'Runtime.executionContextDestroyed', 'Runtime.executionContextsCleared',
  'Runtime.consoleAPICalled', 'Runtime.exceptionThrown',
]);
const BINDING_KEYS = ['attachmentId', 'browserId', 'profileId', 'sessionName', 'targetId', 'generation'] as const;
const MAX_BATCH_BYTES = 1_048_576;
const MAX_COMMAND_BYTES = 8_388_608;

function boundedTimeout(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < 1 || value > 300_000) throw new Error('broker_timeout_invalid');
  return value;
}

function sameBinding(actual: BrokerCdpBinding, expected: BrokerCdpBinding): boolean {
  return !!actual && BINDING_KEYS.every((key) => actual[key] === expected[key]);
}

function snapshotBinding(binding: BrokerCdpBinding): BrokerCdpBinding {
  const snapshot = Object.freeze({ ...binding });
  if (!BINDING_KEYS.every((key) => typeof snapshot[key] === 'string'
    && snapshot[key].length > 0 && snapshot[key].length <= 4096 && snapshot[key].trim() === snapshot[key])) {
    throw new Error('broker_attachment_binding_invalid');
  }
  return snapshot;
}

function diagnosticCause(cause: unknown): Error {
  let current = cause;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!(current instanceof Error)) break;
    if (!(current.cause instanceof Error)) return current;
    current = current.cause;
  }
  return current instanceof Error ? current : new Error('broker_cdp_connection_failed');
}

async function detachConnection(connection: BrokerCdpConnection): Promise<void> {
  const requestId = randomUUID();
  const reply = await bounded((signal) => connection.transport.detach({ binding: connection.binding, requestId }, signal),
    boundedTimeout(connection.detachTimeoutMs, 15_000));
  if (!sameBinding(reply.binding, connection.binding) || reply.requestId !== requestId
    || reply.detached !== true || reply.browserPreserved !== true) throw new Error('broker_detach_unverified');
}

/** One lazy client and one cleanup owner, including admission failure before connect. */
export function createBrokerCdpSession(input: BrokerCdpConnection): BrokerCdpSession {
  const connection = { ...input, binding: snapshotBinding(input.binding) };
  // Validate before ownership publication; do not start an event reader here.
  boundedTimeout(connection.commandTimeoutMs, 120_000);
  boundedTimeout(connection.pollTimeoutMs, 10_000);
  boundedTimeout(connection.detachTimeoutMs, 15_000);
  let client: ChromeClient | undefined;
  let closing: Promise<void> | undefined;
  return Object.freeze({
    binding: connection.binding,
    connect(options: { abortSignal?: AbortSignal } = {}) {
      if (closing || client) throw new Error('broker_session_already_consumed');
      client = createBrokerCdpClient(connection, options);
      return client;
    },
    close() {
      closing ??= client ? client.close() : detachConnection(connection);
      return closing;
    },
  });
}

async function bounded<T>(run: (signal: AbortSignal) => Promise<T>, milliseconds: number, parent?: AbortSignal): Promise<T> {
  const timeout = AbortSignal.timeout(milliseconds);
  const signal = parent ? AbortSignal.any([parent, timeout]) : timeout;
  signal.throwIfAborted();
  let listener: (() => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    listener = () => reject(new Error('broker_operation_interrupted'));
    signal.addEventListener('abort', listener, { once: true });
  });
  try {
    return await Promise.race([Promise.resolve().then(() => { signal.throwIfAborted(); return run(signal); }), aborted]);
  } finally {
    if (listener) signal.removeEventListener('abort', listener);
  }
}

/** Creates a CRI-compatible page-domain facade for an already acquired attachment.
 * No Chrome host, port, WebSocket, discovery, navigation or acquisition fallback.
 * The transport is explicit/injected until native broker admission is integrated.
 */
export function createBrokerCdpClient(
  connection: BrokerCdpConnection,
  options: { abortSignal?: AbortSignal } = {},
): ChromeClient {
  const runSignal = options.abortSignal;
  runSignal?.throwIfAborted();
  const binding = snapshotBinding(connection.binding);
  const transport = connection.transport;
  const commandTimeout = boundedTimeout(connection.commandTimeoutMs, 120_000);
  const pollTimeout = boundedTimeout(connection.pollTimeoutMs, 10_000);
  const detachTimeout = boundedTimeout(connection.detachTimeoutMs, 15_000);
  const emitter = new EventEmitter();
  const lifetime = new AbortController();
  let state: 'open' | 'failed' | 'closing' | 'closed' = 'open';
  let cursor = 0;
  let closePromise: Promise<void> | undefined;
  let disconnected = false;
  const fail = (cause?: unknown) => {
    if (state !== 'open') return;
    state = 'failed';
    runSignal?.removeEventListener('abort', fail);
    lifetime.abort();
    if (!disconnected) {
      disconnected = true;
      emitter.emit('disconnect', diagnosticCause(cause));
    }
  };

  const send = async (method: string, params: Record<string, unknown> = {}): Promise<unknown> => {
    if (state !== 'open') throw new Error('broker_connection_not_open');
    if (!METHODS.has(method)) throw new Error('broker_cdp_method_unsupported');
    if (!params || typeof params !== 'object' || Array.isArray(params)
      || 'sessionId' in params || 'targetId' in params) throw new Error('broker_cdp_params_invalid');
    if (Buffer.byteLength(JSON.stringify(params)) > MAX_COMMAND_BYTES) throw new Error('broker_cdp_command_too_large');
    const requestId = randomUUID();
    let reply: BrokerCdpReply;
    try {
      reply = await bounded((signal) => transport.command({ binding, requestId, method, params }, signal), commandTimeout, lifetime.signal);
      if (state !== 'open' || !sameBinding(reply.binding, binding) || reply.requestId !== requestId) {
        throw new Error('broker_cdp_reply_identity_mismatch');
      }
      if (reply.error !== undefined && (reply.result !== undefined
        || !Number.isInteger(reply.error.code) || typeof reply.error.message !== 'string')) {
        throw new Error('broker_cdp_reply_invalid');
      }
      if (reply.error === undefined && !Object.hasOwn(reply, 'result')) throw new Error('broker_cdp_reply_invalid');
    } catch (cause) {
      fail(cause);
      throw new Error('broker_cdp_outcome_unknown_no_replay', { cause });
    }
    if (reply.error) throw Object.assign(new Error(reply.error.message), { code: reply.error.code });
    return reply.result;
  };

  const pump = async () => {
    try {
      while (state === 'open') {
        const requestId = randomUUID();
        const batch = await bounded((signal) => transport.events({ binding, requestId, cursor }, signal), pollTimeout, lifetime.signal);
        if (state !== 'open') return;
        if (!sameBinding(batch.binding, binding) || batch.requestId !== requestId
          || batch.overflow !== false || !Array.isArray(batch.events)
          || batch.events.length > 256 || Buffer.byteLength(JSON.stringify(batch)) > MAX_BATCH_BYTES) {
          throw new Error('broker_cdp_event_batch_invalid');
        }
        // Validate the whole batch before publishing any bytes to listeners.
        let next = cursor;
        for (const event of batch.events) {
          if (!EVENTS.has(event.method) || event.sequence !== ++next) throw new Error('broker_cdp_event_gap');
        }
        if (batch.cursor !== next) throw new Error('broker_cdp_event_cursor_invalid');
        cursor = next;
        for (const event of batch.events) {
          if (state !== 'open') return;
          connection.onEvent?.({ method: event.method, params: structuredClone(event.params) });
          emitter.emit(event.method, event.params);
          emitter.emit('event', { method: event.method, params: event.params });
        }
        // Empty immediate responses cannot create a hot loop.
        if (batch.events.length === 0) await new Promise<void>((resolve) => setTimeout(resolve, 100));
      }
    } catch (cause) {
      fail(cause);
    }
  };
  // Cancellation seals input/publication, but does not cancel the owner's later
  // close(): that independent, sticky promise must still verify exact detach.
  runSignal?.addEventListener('abort', fail, { once: true });
  if (runSignal?.aborted) fail();
  const pumpPromise = pump();

  const close = (): Promise<void> => {
    if (closePromise) return closePromise;
    state = 'closing';
    runSignal?.removeEventListener('abort', fail);
    lifetime.abort();
    closePromise = (async () => {
      await pumpPromise;
      await detachConnection({ binding, transport, detachTimeoutMs: detachTimeout });
      state = 'closed';
      if (!disconnected) { disconnected = true; emitter.emit('disconnect'); }
    })();
    return closePromise;
  };

  const domains = new Map<string, object>();
  const facade = new Proxy(emitter, {
    get(target, property) {
      if (property === 'then') return undefined;
      if (property === 'send') return send;
      if (property === 'close') return close;
      if (typeof property !== 'string') return Reflect.get(target, property);
      if (property in target) {
        const value = Reflect.get(target, property);
        return typeof value === 'function' ? value.bind(target) : value;
      }
      if (!domains.has(property)) {
        const domain = new Proxy({}, { get(_object, member) {
          if (member === 'then' || typeof member !== 'string') return undefined;
          if (['on', 'once', 'off', 'removeListener'].includes(member)) {
            return (event: string, callback: (...args: unknown[]) => void) => {
              const name = `${property}.${event}`;
              if (!EVENTS.has(name)) throw new Error('broker_cdp_event_unsupported');
              if (member === 'once') emitter.once(name, callback);
              else if (member === 'on') emitter.on(name, callback);
              else emitter.removeListener(name, callback);
              return domain;
            };
          }
          const name = `${property}.${member}`;
          if (EVENTS.has(name)) return (callback: (...args: unknown[]) => void) => {
            emitter.on(name, callback);
            return () => emitter.removeListener(name, callback);
          };
          return (params?: Record<string, unknown>) => send(name, params);
        } });
        domains.set(property, domain);
      }
      return domains.get(property);
    },
  });
  return facade as unknown as ChromeClient;
}
