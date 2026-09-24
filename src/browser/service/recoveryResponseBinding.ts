export interface RecoveryResponseBinding {
  userMessageId: string;
  answerMessageId: string;
  answerText: string;
}

export class RecoveryResponseBindingError extends Error {
  constructor(readonly reason: string) {
    super(`Recovered response is not uniquely bound to the original request (${reason})`);
  }
}

/** Read-only snapshot: no clicks, navigation, prompt submission or cookies. */
export const RECOVERY_RESPONSE_SNAPSHOT = `(() => {
  const nodes = Array.from(document.querySelectorAll('[data-message-author-role]'));
  if (nodes.length > 200) throw new Error('Recovery conversation exceeds message bound');
  const messages = nodes.map(node => {
    let clone = node.cloneNode(true);
    const role = node.getAttribute('data-message-author-role');
    const userContent = role === 'user'
      ? clone.querySelectorAll('[data-testid="collapsible-user-message-content"]') : [];
    if (userContent.length > 1) throw new Error('Recovery user content is ambiguous');
    if (userContent.length === 1 && (userContent[0].textContent || '').trim()) {
      // Attachment tiles and expansion chrome live outside this exact root.
      // Reconstruct rendered code on the detached clone, never the live DOM or
      // expected prompt. Language labels are literal CODE text, not inferred.
      clone = userContent[0];
      const tick = String.fromCharCode(96);
      clone.querySelectorAll('pre > code').forEach(code => {
        code.parentElement.replaceWith(tick.repeat(3) + (code.textContent || '') + '\\n' + tick.repeat(3));
      });
      clone.querySelectorAll('code').forEach(code => {
        code.replaceWith(tick + (code.textContent || '') + tick);
      });
    } else {
      // Preserve legacy plain-user fallback and assistant artifact labels.
      clone.querySelectorAll(role === 'user' ? 'button, [aria-hidden="true"]' : '[aria-hidden="true"]')
        .forEach(child => child.remove());
    }
    return { role,
      id: node.getAttribute('data-message-id'), text: clone.textContent || '' };
  });
  // Global controls have no reliable turn ownership: they always block.
  const unscoped = Boolean(document.querySelector('[data-testid="stop-button"], [data-is-streaming="true"], button[aria-label*="Stop"], button[aria-label*="stop"]'));
  const statuses = Array.from(document.querySelectorAll('[data-streaming-response-status]')).filter(node => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none'
          && style.visibility !== 'hidden' && style.opacity !== '0';
      });
  const owners = statuses.map(node => {
    const turn = node.closest?.('section[data-testid^="conversation-turn-"][data-turn-id]');
    if (!turn || !turn.getAttribute('data-turn-id') ||
        turn.querySelector('[data-message-author-role="user"]')) return null;
    // A status must be inside a distinct assistant turn after a known user.
    // compareDocumentPosition FOLLOWING=4, DISCONNECTED=1.
    const preceding = nodes.filter(message => {
      const position = message.compareDocumentPosition(turn);
      return !(position & 1) && Boolean(position & 4);
    });
    const user = preceding.filter(message => message.getAttribute('data-message-author-role') === 'user').at(-1);
    return user?.getAttribute('data-message-id') || null;
  });
  return { url: location.href,
    generating: unscoped || statuses.length > 0,
    generationScope: { version: 1, unscoped, owners },
    messages };
})()`;

/** Read the same exact conversation through ChatGPT's authenticated read API when long-message DOM is virtualized. */
export const RECOVERY_RESPONSE_API_SNAPSHOT = `(async () => {
  const conversationId = location.pathname.split('/c/').at(-1);
  if (!conversationId || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(conversationId)) {
    throw new Error('Recovery conversation identity is missing');
  }
  const sessionResponse = await fetch('/api/auth/session', { credentials: 'include', headers: { accept: 'application/json' } });
  if (!sessionResponse.ok) throw new Error('Recovery session authority is unavailable');
  const session = await sessionResponse.json();
  if (typeof session?.accessToken !== 'string' || !session.accessToken || typeof session?.account?.id !== 'string' || !session.account.id) {
    throw new Error('Recovery session authority is incomplete');
  }
  const response = await fetch('/backend-api/conversations/' + conversationId + '?include_has_versions=true&num_turns=10', {
    credentials: 'include', headers: { accept: 'application/json', authorization: 'Bearer ' + session.accessToken,
      'chatgpt-account-id': session.account.id },
  });
  if (!response.ok) throw new Error('Recovery conversation read failed');
  const data = await response.json();
  if (data?.conversation_id !== conversationId || !Array.isArray(data?.messages) || data.messages.length > 200) {
    throw new Error('Recovery conversation response is inconsistent');
  }
  const messages = data.messages.flatMap(message => {
    const role = message?.author?.role;
    const parts = message?.content?.parts;
    if ((role !== 'user' && role !== 'assistant') || !Array.isArray(parts) || parts.some(part => typeof part !== 'string')) return [];
    if (role === 'assistant' && (message.status !== 'finished_successfully' || message.end_turn !== true)) return [];
    const text = parts.join('\\n');
    return typeof message.id === 'string' && message.id && text.trim() ? [{ role, id: message.id, text }] : [];
  });
  const current = data.messages.find(message => message?.id === data.current_node);
  const generating = !(current?.author?.role === 'assistant' && current?.status === 'finished_successfully' && current?.end_turn === true);
  return { url: location.href, snapshotSource: 'authenticated_conversation_api_v1', generating,
    generationScope: { version: 1, unscoped: false, owners: [] }, messages };
})()`;

/** Project display slugs are not identity; both stable IDs must remain exact. */
function sameRecoveryConversationUrl(actual: unknown, expected: string): boolean {
  if (actual === expected) return true;
  if (typeof actual !== 'string') return false;
  const identity = (raw: string): string | null => {
    try {
      const url = new URL(raw);
      if (url.origin !== 'https://chatgpt.com' || url.username || url.password || url.search || url.hash) return null;
      const match = /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/c\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/.exec(url.pathname);
      return match ? `${match[1]}/${match[2]}` : null;
    } catch { return null; }
  };
  const expectedIdentity = identity(expected);
  return expectedIdentity !== null && identity(actual) === expectedIdentity;
}

/** Match the exact text ChatGPT renders after removing Markdown presentation syntax. */
function renderedPromptText(text: string): string {
  return text.split(/\r?\n/u).map(line => line
    .replace(/^\s{0,3}#{1,6}\s+/u, '')
    .replace(/^\s*[-+*]\s+/u, '')
    .replace(/^\s*\d+[.)]\s+/u, '')
  ).join('\n')
    .replace(/\*\*([^*\n]+)\*\*/gu, '$1')
    .replace(/__([^_\n]+)__/gu, '$1')
    .replace(/~~([^~\n]+)~~/gu, '$1');
}

/**
 * ChatGPT's authenticated conversation API serializes pasted Markdown as one
 * line, escapes presentation punctuation, and expands bare HTTPS URLs into
 * self-labelled Markdown links. Invert only those lossless rewrites, and only
 * when the expected wire contains no literal backslash (which would make an
 * escaped character ambiguous).
 */
function authenticatedApiPromptText(text: string, expected: string): string {
  if (expected.includes('\\')) return text;
  return text
    .replace(/\[(https:\/\/[^\]\s]+)\]\(\1\)/gu, '$1')
    .replace(/\\([*`:])/gu, '$1');
}

/** Exact normalized prompt equality is required; prefixes and URLs are not proof. */
export function bindRecoveredResponse(
  snapshot: unknown,
  expectedPrompt: string,
  expectedUrl: string,
  expectedUserMessageId?: string,
): RecoveryResponseBinding {
  const fail = (reason: string): never => { throw new RecoveryResponseBindingError(reason); };
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return fail('snapshot_shape');
  const value = snapshot as Record<string, unknown>;
  if (!sameRecoveryConversationUrl(value.url, expectedUrl) ||
      typeof value.generating !== 'boolean' || !Array.isArray(value.messages)) return fail('conversation_shape');
  const normalize = (text: string) => text.replace(/\s+/gu, ' ').trim();
  const prompt = normalize(expectedPrompt);
  const renderedPrompt = normalize(renderedPromptText(expectedPrompt));
  if (!prompt || value.messages.length > 200) return fail('message_bound');
  const messages = value.messages as Array<Record<string, unknown>>;
  if (messages.some(message => !message || typeof message !== 'object' || Array.isArray(message))) return fail('message_shape');
  const apiSnapshot = value.snapshotSource === 'authenticated_conversation_api_v1';
  const matches = messages.map((message, index) => ({ message, index })).filter(({ message }) => {
    if (message.role !== 'user' || typeof message.text !== 'string') return false;
    const observed = normalize(message.text);
    const candidates = apiSnapshot
      ? [observed, normalize(authenticatedApiPromptText(message.text, expectedPrompt))]
      : [observed];
    return candidates.some(candidate => [prompt, renderedPrompt].includes(candidate));
  });
  if (matches.length !== 1) {
    const userLengths = messages.filter(message => message.role === 'user' && typeof message.text === 'string')
      .map(message => normalize(String(message.text)).length).join('_') || 'none';
    return fail(`prompt_matches_${matches.length}_expected_${prompt.length}_rendered_${renderedPrompt.length}_users_${userLengths}`);
  }
  const { message: user, index } = matches[0]!;
  if (expectedUserMessageId && user.id !== expectedUserMessageId) return fail('submitted_user_identity');
  const following = messages.slice(index + 1);
  const nextUser = following.findIndex(message => message.role === 'user');
  const answers = (nextUser < 0 ? following : following.slice(0, nextUser))
    .filter(message => message.role === 'assistant');
  if (answers.length !== 1) return fail(`assistant_answers_${answers.length}`);
  const answer = answers[0]!;
  if (typeof user.id !== 'string' || !user.id.trim() || typeof answer.id !== 'string' || !answer.id.trim() ||
      user.id === answer.id || typeof answer.text !== 'string' || !answer.text.trim()) return fail('message_identity');
  if (messages.filter(message => message.id === user.id).length !== 1 ||
      messages.filter(message => message.id === answer.id).length !== 1) return fail('duplicate_message_identity');
  if (value.generating) {
    const scope = value.generationScope as Record<string, unknown> | undefined;
    if (!scope || scope.version !== 1 || scope.unscoped !== false ||
        !Array.isArray(scope.owners) || scope.owners.length === 0) return fail('generation_scope');
    for (const owner of scope.owners) {
      if (typeof owner !== 'string' || !owner.trim()) return fail('generation_owner');
      const occurrences = messages.map((message, position) => ({ message, position }))
        .filter(({ message }) => message.id === owner);
      if (occurrences.length !== 1 || occurrences[0]!.message.role !== 'user' ||
          occurrences[0]!.position <= messages.indexOf(answer)) return fail('generation_order');
    }
  }
  return { userMessageId: user.id, answerMessageId: answer.id, answerText: answer.text };
}
