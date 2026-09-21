import { expect, it, vi } from 'vitest';
import { assertChatgptNewConversationDispatch, isChatgptNewConversationRoute } from '../../src/browser/providers/chatgptNewConversation.js';
import { resolveBrowserConfig } from '../../src/browser/config.js';
import type { ChromeClient } from '../../src/browser/types.js';

const project = 'g-p-0123456789abcdef0123456789abcdef';
const root = `https://chatgpt.com/g/${project}/project`;
const conversation = `https://chatgpt.com/g/${project}-workshop/c/01234567-89ab-cdef-0123-456789abcdef`;

it('accepts only exact project roots before and real same-project conversations after', () => {
  expect(isChatgptNewConversationRoute(root, project, 'before')).toBe(true);
  expect(isChatgptNewConversationRoute(conversation, project, 'after')).toBe(true);
  for (const url of [root, 'https://chatgpt.com/c/01234567-89ab-cdef-0123-456789abcdef', conversation.replace(project, 'g-p-ffffffffffffffffffffffffffffffff'), `${conversation}?q=1`, `${conversation}#x`, conversation.replace('chatgpt.com', 'example.com'), conversation.replace('https:', 'http:'), conversation.replace('01234567-89ab-cdef-0123-456789abcdef', 'not-a-conversation')]) {
    expect(isChatgptNewConversationRoute(url, project, 'after')).toBe(false);
  }
  expect(isChatgptNewConversationRoute(conversation, project, 'before')).toBe(false);
});

it.each([
  { url: conversation, messageCount: 0, promptReady: true },
  { url: root, messageCount: 1, promptReady: true },
  { url: root, messageCount: 0, promptReady: false },
])('rejects non-fresh or unavailable composer without mutation: %j', async (probe) => {
  const runtime = { evaluate: vi.fn(async () => ({ result: { value: probe } })) } as unknown as ChromeClient['Runtime'];
  await expect(assertChatgptNewConversationDispatch(runtime, project, 'before')).rejects.toMatchObject({ details: { code: 'chatgpt_new_conversation_precondition_failed', retryable: false } });
  expect(runtime.evaluate).toHaveBeenCalledOnce();
});

it('waits read-only for same-project route convergence; unknown outcome cannot authorize replay', async () => {
  const runtime = { evaluate: vi.fn().mockResolvedValueOnce({ result: { value: { url: root, messageCount: 0, promptReady: true } } }).mockResolvedValue({ result: { value: { url: conversation } } }) } as unknown as ChromeClient['Runtime'];
  await expect(assertChatgptNewConversationDispatch(runtime, project, 'before')).resolves.toBe(root);
  await expect(assertChatgptNewConversationDispatch(runtime, project, 'after')).resolves.toBe(conversation);
  vi.mocked(runtime.evaluate).mockResolvedValue({ result: { value: { url: root } } } as never);
  await expect(assertChatgptNewConversationDispatch(runtime, project, 'after', 0)).rejects.toMatchObject({ details: { code: 'chatgpt_new_conversation_outcome_unknown', retryable: false } });
});

it('preserves explicit browser option through config resolution', () => {
  expect(resolveBrowserConfig({ projectId: project, chatgptNewConversationProjectId: project, url: root })).toMatchObject({ projectId: project, chatgptNewConversationProjectId: project });
});
