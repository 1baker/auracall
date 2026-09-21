import { describe, expect, test, vi } from 'vitest';
import {
  assertChatgptConversationCapacityAvailable,
  buildChatgptConversationCapacityExpression,
  isChatgptConversationCapacityText,
} from '../../src/browser/providers/chatgptConversationCapacity.js';
import { waitForAssistantResponse } from '../../src/browser/actions/assistantResponse.js';
import type { ChromeClient } from '../../src/browser/types.js';

const warning = "You've reached the maximum length for this conversation, but you can keep talking by starting a new chat. Start new chat";
function message(id: string, role = 'assistant', text = warning, action = true) {
  return {
    innerText: text,
    getAttribute: (key: string) => key === 'data-message-id' ? id : role,
    closest() { return this; },
    querySelectorAll: () => action ? [{ innerText: 'Start new chat' }] : [],
  };
}
function probe(messages: ReturnType<typeof message>[], id = 'current') {
  return new Function('document', `return ${buildChatgptConversationCapacityExpression(id)}`)({ querySelectorAll: () => messages });
}

describe('ChatGPT conversation capacity', () => {
  test('recognizes the exact provider notice but not explanatory quotations', () => {
    expect(isChatgptConversationCapacityText(warning)).toBe(true);
    expect(isChatgptConversationCapacityText(warning.replace("You've", 'You’ve'))).toBe(true);
    expect(isChatgptConversationCapacityText(`The UI says: ${warning}`)).toBe(false);
    expect(isChatgptConversationCapacityText(`"${warning}"`)).toBe(false);
  });
  test('requires exact final assistant identity and provider action', () => {
    expect(probe([message('user', 'user', 'Write a guide'), message('current')])).toBe(true);
    expect(probe([message('current', 'user')])).toBe(false);
    expect(probe([message('current'), message('next-user', 'user', 'Continue')])).toBe(false);
    expect(probe([message('current'), message('later', 'assistant', 'Normal response')])).toBe(false);
    expect(probe([message('old')])).toBe(false);
    expect(probe([message('current'), message('current')])).toBe(false);
    expect(probe([message('current', 'assistant', warning, false)])).toBe(false);
  });
  test('throws structured nonretryable failure only after exact DOM confirmation', async () => {
    const runtime = { evaluate: vi.fn().mockResolvedValue({ result: { value: true } }) } as unknown as ChromeClient['Runtime'];
    await expect(assertChatgptConversationCapacityAvailable(runtime, { text: warning, meta: { messageId: 'current' } })).rejects.toMatchObject({
      details: { code: 'chatgpt_conversation_capacity_exhausted', retryable: false, recoveryAction: 'new_conversation_required', messageId: 'current' },
    });
    vi.mocked(runtime.evaluate).mockResolvedValue({ result: { value: false } } as never);
    await expect(assertChatgptConversationCapacityAvailable(runtime, { text: warning, meta: { messageId: 'current' } })).resolves.toBeUndefined();
  });
  test('polling terminates a fresh capacity notice without awaiting missing completion controls', async () => {
    const runtime = { evaluate: vi.fn(async ({ expression }: { expression: string }) => ({ result: { value:
      expression.includes('extractAssistantTurn') ? { text: warning, messageId: 'current', turnIndex: 3 } : true,
    } })) } as unknown as ChromeClient['Runtime'];
    await expect(waitForAssistantResponse(runtime, 100, () => undefined, 2, { baselineAssistant: { messageId: 'old' } })).rejects.toMatchObject({
      details: { code: 'chatgpt_conversation_capacity_exhausted' },
    });
  });
  test('baseline warning remains historical and cannot trigger capacity failure', async () => {
    const runtime = { evaluate: vi.fn(async ({ expression }: { expression: string }) => ({ result: { value:
      expression.includes('extractAssistantTurn') ? { text: warning, messageId: 'old', turnIndex: 3 } : null,
    } })) } as unknown as ChromeClient['Runtime'];
    await expect(waitForAssistantResponse(runtime, 1, () => undefined, 2, { baselineAssistant: { messageId: 'old' } })).rejects.toThrow('assistant-response-watchdog-timeout');
    expect(vi.mocked(runtime.evaluate).mock.calls.some(([call]) => call.expression.includes('expectedId'))).toBe(false);
  });
});
