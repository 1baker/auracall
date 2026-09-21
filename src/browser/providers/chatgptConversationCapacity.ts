import { BrowserAutomationError } from '../../oracle/errors.js';
import type { ChromeClient } from '../types.js';

export const CHATGPT_CONVERSATION_CAPACITY_CODE = 'chatgpt_conversation_capacity_exhausted';

export function isChatgptConversationCapacityText(text: string): boolean {
  return /^(?:ChatGPT said:\s*)?You['’]ve reached the maximum length for this conversation, but you can keep talking by starting a new chat\.?\s*(?:Start new chat)?$/i.test(text.replace(/\s+/g, ' ').trim());
}

// A page-wide warning or a historical/user-quoted message is not evidence that
// this response exhausted its conversation. Recheck the exact fresh assistant
// identity, final message position, provider action, and text together.
export function buildChatgptConversationCapacityExpression(messageId: string): string {
  return `(() => {
    const expectedId = ${JSON.stringify(messageId)};
    const messages = Array.from(document.querySelectorAll('[data-message-id][data-message-author-role]'));
    const matches = messages.filter(node => node.getAttribute('data-message-id') === expectedId);
    if (matches.length !== 1) return false;
    const message = matches[0];
    if (message.getAttribute('data-message-author-role') !== 'assistant' || messages.at(-1) !== message) return false;
    const turn = message.closest('[data-testid^="conversation-turn"], [data-turn-id]') || message;
    if (!Array.from(turn.querySelectorAll('button, a')).some(node => /^Start new chat$/i.test((node.innerText || node.textContent || '').trim()))) return false;
    const text = (message.innerText || message.textContent || '').replace(/\\s+/g, ' ').trim();
    return (${isChatgptConversationCapacityText.toString()})(text);
  })()`;
}

export async function assertChatgptConversationCapacityAvailable(
  runtime: ChromeClient['Runtime'],
  response: { text: string; meta: { messageId?: string | null; turnId?: string | null } },
): Promise<void> {
  const messageId = response.meta.messageId?.trim();
  if (!messageId || !isChatgptConversationCapacityText(response.text)) return;
  const result = await runtime.evaluate({
    expression: buildChatgptConversationCapacityExpression(messageId),
    returnByValue: true,
  });
  if (result.result?.value !== true) return;
  throw new BrowserAutomationError(
    'ChatGPT conversation capacity exhausted; this response cannot continue in the same chat.',
    { code: CHATGPT_CONVERSATION_CAPACITY_CODE, stage: 'assistant-response', retryable: false,
      recoveryAction: 'new_conversation_required', messageId, turnId: response.meta.turnId ?? null },
  );
}
