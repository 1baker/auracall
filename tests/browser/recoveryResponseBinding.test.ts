import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { bindRecoveredResponse, RECOVERY_RESPONSE_SNAPSHOT } from '../../src/browser/service/recoveryResponseBinding.js';

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
