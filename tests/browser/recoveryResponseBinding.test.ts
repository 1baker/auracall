import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { bindRecoveredResponse, RECOVERY_RESPONSE_API_SNAPSHOT, RECOVERY_RESPONSE_SNAPSHOT } from '../../src/browser/service/recoveryResponseBinding.js';

const url = 'https://chatgpt.com/c/original';
const prompt = 'Original complete request ACDOC-test';
const user = { role: 'user', id: 'user-original', text: prompt };
const answer = { role: 'assistant', id: 'answer-original', text: 'The original answer' };
const snapshot = (messages: unknown[]) => ({ url, generating: false, messages });

describe('recovered response binding', () => {
  const projectPath = '/g/g-p-6a7e016622e48191a60c4bc34366b537';
  const conversationPath = '/c/6a80e64e-e830-83ea-b21f-9079abf27a1d';
  const slugged = `https://chatgpt.com${projectPath}-codex-chatgpt-workshop${conversationPath}`;
  const canonical = `https://chatgpt.com${projectPath}${conversationPath}`;
  it('accepts provider project-slug removal without changing either stable ID', () => {
    expect(bindRecoveredResponse({ ...snapshot([user, answer]), url: canonical }, prompt, slugged).answerMessageId).toBe(answer.id);
  });
  it('requires the exact submitted user ID for attachment-backed recovery', () => {
    expect(bindRecoveredResponse(snapshot([user, answer]), prompt, url, user.id).answerMessageId).toBe(answer.id);
    expect(() => bindRecoveredResponse(snapshot([user, answer]), prompt, url, 'other-user'))
      .toThrow('submitted_user_identity');
  });
  it.each([
    canonical.replace('chatgpt.com', 'example.com'),
    canonical.replace('https:', 'http:'),
    canonical.replace('6a7e0166', '7a7e0166'),
    canonical.replace('6a80e64e', '7a80e64e'),
    canonical + '?redirect=1', canonical + '#other',
    canonical.replace('chatgpt.com', 'user@chatgpt.com'),
    `https://chatgpt.com${conversationPath}`,
  ])('rejects non-equivalent recovery URL %s', actual => {
    expect(() => bindRecoveredResponse({ ...snapshot([user, answer]), url: actual }, prompt, slugged)).toThrow();
  });
  it('preserves assistant file-button text while removing user expansion controls', () => {
    const nodes = [user, { ...answer, text: 'result.docx result.pdf' }].map(message => ({
      getAttribute: (name: string) => name === 'data-message-author-role' ? message.role : message.id,
      cloneNode: () => {
        const clone = {
          textContent: message.text + (message.role === 'user' ? ' Show more' : ''),
          querySelectorAll: (selector: string) => selector.includes('button') ? [{ remove: () => {
            clone.textContent = message.role === 'user' ? message.text : '';
          } }] : [],
        };
        return clone;
      },
    }));
    const live = runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, {
      location: { href: url }, document: {
        querySelector: () => null,
        querySelectorAll: (selector: string) => selector === '[data-message-author-role]' ? nodes : [],
      },
    });
    expect(bindRecoveredResponse(live, prompt, url).answerText).toBe('result.docx result.pdf');
  });
  it('falls back to the populated user parent when the collapsible child is empty', () => {
    const nodes = [user, answer].map(message => ({
      getAttribute: (name: string) => name === 'data-message-author-role' ? message.role : message.id,
      cloneNode: () => {
        const clone = {
          textContent: message.text + (message.role === 'user' ? ' Show more' : ''),
          querySelectorAll: (selector: string) => {
            if (selector === '[data-testid="collapsible-user-message-content"]' && message.role === 'user') {
              return [{ textContent: '' }];
            }
            return selector.includes('button') ? [{ remove: () => { clone.textContent = message.text; } }] : [];
          },
        };
        return clone;
      },
    }));
    const live = runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, {
      location: { href: url }, document: {
        querySelector: () => null,
        querySelectorAll: (selector: string) => selector === '[data-message-author-role]' ? nodes : [],
      },
    });
    expect(bindRecoveredResponse(live, prompt, url).answerMessageId).toBe(answer.id);
  });
  it('reads exact finished user and assistant messages when the long-message DOM is virtualized', async () => {
    const conversationId = '6ab287ae-5694-83ea-96a2-971907b6deb9';
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const live = await runInNewContext(RECOVERY_RESPONSE_API_SNAPSHOT, {
      location: { href: url, pathname: `/c/${conversationId}` },
      fetch: async (input: string, init?: RequestInit) => {
        requests.push({ url: input, init });
        if (input === '/api/auth/session') return { ok: true, json: async () => ({ accessToken: 'ephemeral', account: { id: 'account-1' } }) };
        return { ok: true, json: async () => ({ conversation_id: conversationId, current_node: answer.id, messages: [
          { id: user.id, author: { role: 'user' }, content: { parts: [prompt] }, status: 'finished_successfully', end_turn: null },
          { id: 'analysis', author: { role: 'assistant' }, content: { text: 'hidden' }, status: 'finished_successfully', end_turn: null },
          { id: answer.id, author: { role: 'assistant' }, content: { parts: [answer.text] }, status: 'finished_successfully', end_turn: true },
        ] }) };
      },
    });
    expect(bindRecoveredResponse(live, prompt, url).answerMessageId).toBe(answer.id);
    expect(requests[1]?.url).toContain(`/backend-api/conversations/${conversationId}`);
    expect((requests[1]?.init?.headers as Record<string, string>).authorization).toBe('Bearer ephemeral');
  });
  it('binds the authenticated API representation of a pasted Markdown prompt', () => {
    const markdown = 'Review **exactly** `sha256` at https://example.com/a-b and keep colon\\: literal'.replace('colon\\:', 'colon:');
    const stored = 'Review \\*\\*exactly\\*\\* \\`sha256\\` at [https://example.com/a-b](https://example.com/a-b) and keep colon\\: literal';
    expect(bindRecoveredResponse({ ...snapshot([{ ...user, text: stored }, answer]),
      snapshotSource: 'authenticated_conversation_api_v1' }, markdown, url).answerMessageId).toBe(answer.id);
  });
  it('does not invert authenticated API escapes when the durable wire contains a literal backslash', () => {
    const expected = 'Keep literal \\* text';
    expect(() => bindRecoveredResponse({ ...snapshot([{ ...user, text: 'Keep literal \\* text' }, answer]),
      snapshotSource: 'authenticated_conversation_api_v1' }, expected, url)).not.toThrow();
    expect(() => bindRecoveredResponse({ ...snapshot([{ ...user, text: 'Keep literal * text' }, answer]),
      snapshotSource: 'authenticated_conversation_api_v1' }, expected, url)).toThrow();
  });
  it('binds the original pair even when unrelated later turns exist', () => {
    expect(bindRecoveredResponse(snapshot([
      user, answer, { role: 'user', id: 'later-user', text: 'Different request' },
      { role: 'assistant', id: 'later-answer', text: 'Unrelated answer' },
    ]), prompt, url)).toEqual({
      userMessageId: user.id, answerMessageId: answer.id, answerText: answer.text,
    });
  });
  it('allows whitespace differences but not content differences', () => {
    expect(bindRecoveredResponse(snapshot([{ ...user, text: 'Original\n complete request  ACDOC-test' }, answer]), prompt, url).answerMessageId).toBe(answer.id);
  });
  it('binds the exact rendered text of Markdown headings, lists, and emphasis', () => {
    const markdown = '# Release review\n\n- **Gate:** preserve `exact_code`\n1. Verify authority';
    const rendered = 'Release review\n\nGate: preserve `exact_code`\nVerify authority';
    expect(bindRecoveredResponse(snapshot([{ ...user, text: rendered }, answer]), markdown, url).answerMessageId).toBe(answer.id);
  });
  it.each([
    [], [answer], [user],
    [{ ...user, text: prompt + ' extra content' }, answer],
    [{ ...user, text: prompt.slice(0, 12) }, answer],
    [user, answer, { ...user, id: 'duplicate-user' }, { ...answer, id: 'duplicate-answer' }],
    [user, answer, { ...answer, id: 'alternative-answer' }],
    [{ ...user, id: '' }, answer],
    [user, { ...answer, id: user.id }],
    [user, { ...answer, text: '' }],
    [user, { role: 'user', id: 'intervening', text: 'Other request' }, answer],
    [user, answer, { role: 'tool', id: answer.id, text: 'duplicate identity' }],
  ])('rejects incomplete or ambiguous history %j', (...messages) => {
    expect(() => bindRecoveredResponse(snapshot(messages), prompt, url)).toThrow();
  });
  it('rejects wrong URL, streaming, malformed snapshots and empty requests', () => {
    for (const value of [null, {}, { ...snapshot([user, answer]), url: url + '-wrong' },
      { ...snapshot([user, answer]), generating: true }]) {
      expect(() => bindRecoveredResponse(value, prompt, url)).toThrow();
    }
    expect(() => bindRecoveredResponse(snapshot([user, answer]), '', url)).toThrow();
  });
});
