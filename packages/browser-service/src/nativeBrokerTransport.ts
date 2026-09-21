import { createConnection } from 'node:net';
import { isAbsolute } from 'node:path';
import type { BrokerCdpBinding, BrokerCdpTransport } from './brokerCdpClient.js';

type Command = Parameters<BrokerCdpTransport['command']>[0] & { operation: 'command' };
type Events = Parameters<BrokerCdpTransport['events']>[0] & { operation: 'events' };
type Detach = Parameters<BrokerCdpTransport['detach']>[0] & { operation: 'detach' };
type Request = Command | Events | Detach;

export type NativeBrokerTransportOptions = {
  /** Trusted acquisition configuration, never a Chrome URL or discovered lane. */
  socketPath: string;
  authToken: string | (() => Promise<string>);
  binding: BrokerCdpBinding;
  /** Supplies existing approved authority; the connector cannot issue or renew it. */
  taskContext(request: Command, signal: AbortSignal): Promise<Record<string, unknown>>;
  timeoutMs?: number;
};

const KEYS = ['attachmentId', 'browserId', 'profileId', 'sessionName', 'targetId', 'generation'] as const;
const unknownOutcome = (stage?: string) => new Error(
  'broker_native_outcome_unknown_no_replay',
  stage ? { cause: new Error(stage) } : undefined,
);

function boundedTaskContextStage(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : '';
  if (/^broker_native_[A-Za-z0-9_.: -]{1,384}$/.test(message)) {
    return `broker_native_task_context_failed:${message}`;
  }
  return 'broker_native_task_context_failed';
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Explicit Unix daemon transport. No launch, credential discovery, raw CDP,
 * connection pooling or retries. Each operation owns its socket and cancellation.
 * Native custody/task admission remains authoritative, including for cleanup.
 */
export function createNativeBrokerTransport(options: NativeBrokerTransportOptions): BrokerCdpTransport {
  const { socketPath, authToken, taskContext } = options;
  const binding = Object.freeze({ ...options.binding });
  const timeoutMs = options.timeoutMs ?? 120_000;
  if (process.platform === 'win32' || !isAbsolute(socketPath) || socketPath.includes('\0')
    || Buffer.byteLength(socketPath) > 107
    || (typeof authToken !== 'string' && typeof authToken !== 'function')
    || (typeof authToken === 'string' && (!authToken || authToken.length > 4096))
    || !KEYS.every((key) => typeof binding[key] === 'string' && binding[key].trim() === binding[key]
      && binding[key].length > 0 && binding[key].length <= 4096)
    || typeof taskContext !== 'function' || !Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 300_000) {
    throw new Error('broker_native_configuration_invalid');
  }
  // Commands can mutate page state, so their request ids remain consumed for
  // the lifetime of the attachment. Event polls are passive and occur every
  // 100 ms while Pro reasons; retaining every poll id made a healthy response
  // fail deterministically after 4,096 operations. Keep a bounded recent
  // replay window for passive reads without imposing a session-duration cap.
  const durableConsumed = new Set<string>();
  const recentPassiveConsumed = new Set<string>();
  const recentPassiveOrder: string[] = [];
  const rememberRequest = (request: Request) => {
    if (durableConsumed.has(request.requestId) || recentPassiveConsumed.has(request.requestId)) {
      throw new Error('broker_native_request_not_replayable');
    }
    if (request.operation === 'events') {
      recentPassiveConsumed.add(request.requestId);
      recentPassiveOrder.push(request.requestId);
      if (recentPassiveOrder.length > 4096) {
        const expired = recentPassiveOrder.shift();
        if (expired !== undefined) recentPassiveConsumed.delete(expired);
      }
      return;
    }
    if (request.operation !== 'detach' && durableConsumed.size >= 4096) {
      throw new Error('broker_native_request_not_replayable');
    }
    durableConsumed.add(request.requestId);
  };

  const exchange = async (input: Request, parent: AbortSignal): Promise<unknown> => {
    // Snapshot before awaiting application code so authority sees the same request
    // that will be sent, even if the caller/provider mutates its own objects.
    const request: Request = JSON.parse(JSON.stringify(input));
    if (!KEYS.every((key) => request.binding?.[key] === binding[key])
      || typeof request.requestId !== 'string' || !request.requestId.trim()
      || request.requestId.length > 128 || request.requestId.trim() !== request.requestId) {
      throw new Error('broker_native_request_invalid');
    }
    parent.throwIfAborted();
    rememberRequest(request);
    const signal = AbortSignal.any([parent, AbortSignal.timeout(timeoutMs)]);
    return new Promise((resolve, reject) => {
      let socket: ReturnType<typeof createConnection> | undefined;
      let done = false;
      const finish = (error?: Error, result?: unknown) => {
        if (done) return;
        done = true;
        signal.removeEventListener('abort', abort);
        socket?.destroy();
        if (error) reject(error); else resolve(result);
      };
      const abort = () => finish(unknownOutcome('broker_native_aborted'));
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) { abort(); return; }
      void (async () => {
        let brokerRequest: Request & { taskContext?: Record<string, unknown> } = request;
        if (request.operation === 'command') {
          let context: Record<string, unknown>;
          try {
            context = await taskContext(structuredClone(request), signal);
          } catch (cause) {
            throw unknownOutcome(boundedTaskContextStage(cause));
          }
          if (done || signal.aborted) return;
          if (!object(context) || !object(context.taskAuthority)
            || typeof context.taskStepId !== 'string' || !context.taskStepId.trim()
            || Buffer.byteLength(JSON.stringify(context)) > 65_536) {
            throw unknownOutcome('broker_native_task_context_invalid');
          }
          brokerRequest = { ...request, taskContext: context };
        }
        let resolvedAuthToken: string;
        try {
          resolvedAuthToken = typeof authToken === 'function' ? await authToken() : authToken;
        } catch {
          throw unknownOutcome('broker_native_auth_token_read_failed');
        }
        if (!resolvedAuthToken || resolvedAuthToken.length > 4096) {
          throw unknownOutcome('broker_native_auth_token_invalid');
        }
        const bytes = Buffer.from(`${JSON.stringify({ id: request.requestId, action: '__broker_transport',
          _agentBrowserAuthToken: resolvedAuthToken, brokerRequest })}\n`);
        if (bytes.length > 9_000_000) throw unknownOutcome('broker_native_request_too_large');
        if (done || signal.aborted) return;
        try {
          socket = createConnection({ path: socketPath });
        } catch {
          throw unknownOutcome('broker_native_socket_create_failed');
        }
        const chunks: Buffer[] = [];
        let size = 0;
        const limit = request.operation === 'events' ? 1_048_576 : 16_777_216;
        socket.on('error', () => finish(unknownOutcome('broker_native_socket_error')));
        socket.on('end', () => finish(unknownOutcome('broker_native_socket_ended_before_reply')));
        socket.on('close', () => finish(unknownOutcome('broker_native_socket_closed_before_reply')));
        socket.once('connect', () => {
          if (done || signal.aborted) { abort(); return; }
          socket?.write(bytes);
        });
        socket.on('data', (chunk: Buffer) => {
          if (done) return;
          size += chunk.length;
          if (size > limit) { finish(unknownOutcome('broker_native_response_too_large')); return; }
          chunks.push(chunk);
          if (!chunk.includes(10)) return;
          try {
            const packet = Buffer.concat(chunks);
            const newline = packet.indexOf(10);
            if (newline !== packet.length - 1) throw unknownOutcome('broker_native_response_trailing_bytes');
            const response: unknown = JSON.parse(packet.subarray(0, newline).toString('utf8'));
            if (!object(response) || response.id !== request.requestId || response.success !== true) {
              throw unknownOutcome('broker_native_response_envelope_invalid');
            }
            const data = response.data;
            if (!object(data) || data.requestId !== request.requestId || !object(data.binding)) {
              throw unknownOutcome('broker_native_response_data_invalid');
            }
            const actualBinding = data.binding;
            if (!KEYS.every((key) => actualBinding[key] === binding[key])) {
              throw unknownOutcome('broker_native_response_binding_mismatch');
            }
            finish(undefined, data);
          } catch (cause) {
            finish(cause instanceof Error && cause.message === 'broker_native_outcome_unknown_no_replay'
              ? cause
              : unknownOutcome('broker_native_response_parse_failed'));
          }
        });
      })().catch((cause) => finish(
        cause instanceof Error && cause.message === 'broker_native_outcome_unknown_no_replay'
          ? cause
          : unknownOutcome('broker_native_setup_failed'),
      ));
    });
  };
  return {
    command: (request, signal) => exchange({ ...request, operation: 'command' }, signal) as ReturnType<BrokerCdpTransport['command']>,
    events: (request, signal) => exchange({ ...request, operation: 'events' }, signal) as ReturnType<BrokerCdpTransport['events']>,
    detach: (request, signal) => exchange({ ...request, operation: 'detach' }, signal) as ReturnType<BrokerCdpTransport['detach']>,
  };
}
