export interface RecoveryResponseBinding {
  userMessageId: string;
  answerMessageId: string;
  answerText: string;
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
    if (userContent.length === 1) {
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

/** Exact normalized prompt equality is required; prefixes and URLs are not proof. */
export function bindRecoveredResponse(
  snapshot: unknown,
  expectedPrompt: string,
  expectedUrl: string,
): RecoveryResponseBinding {
  const fail = (): never => { throw new Error('Recovered response is not uniquely bound to the original request'); };
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return fail();
  const value = snapshot as Record<string, unknown>;
  if (!sameRecoveryConversationUrl(value.url, expectedUrl) ||
      typeof value.generating !== 'boolean' || !Array.isArray(value.messages)) return fail();
  const normalize = (text: string) => text.replace(/\s+/gu, ' ').trim();
  const prompt = normalize(expectedPrompt);
  if (!prompt || value.messages.length > 200) return fail();
  const messages = value.messages as Array<Record<string, unknown>>;
  if (messages.some(message => !message || typeof message !== 'object' || Array.isArray(message))) return fail();
  const matches = messages.map((message, index) => ({ message, index })).filter(({ message }) =>
    message.role === 'user' && typeof message.text === 'string' && normalize(message.text) === prompt);
  if (matches.length !== 1) return fail();
  const { message: user, index } = matches[0]!;
  const following = messages.slice(index + 1);
  const nextUser = following.findIndex(message => message.role === 'user');
  const answers = (nextUser < 0 ? following : following.slice(0, nextUser))
    .filter(message => message.role === 'assistant');
  if (answers.length !== 1) return fail();
  const answer = answers[0]!;
  if (typeof user.id !== 'string' || !user.id.trim() || typeof answer.id !== 'string' || !answer.id.trim() ||
      user.id === answer.id || typeof answer.text !== 'string' || !answer.text.trim()) return fail();
  if (messages.filter(message => message.id === user.id).length !== 1 ||
      messages.filter(message => message.id === answer.id).length !== 1) return fail();
  if (value.generating) {
    const scope = value.generationScope as Record<string, unknown> | undefined;
    if (!scope || scope.version !== 1 || scope.unscoped !== false ||
        !Array.isArray(scope.owners) || scope.owners.length === 0) return fail();
    for (const owner of scope.owners) {
      if (typeof owner !== 'string' || !owner.trim()) return fail();
      const occurrences = messages.map((message, position) => ({ message, position }))
        .filter(({ message }) => message.id === owner);
      if (occurrences.length !== 1 || occurrences[0]!.message.role !== 'user' ||
          occurrences[0]!.position <= messages.indexOf(answer)) return fail();
    }
  }
  return { userMessageId: user.id, answerMessageId: answer.id, answerText: answer.text };
}
