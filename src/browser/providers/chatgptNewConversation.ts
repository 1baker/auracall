import { BrowserAutomationError } from '../../oracle/errors.js';
import { INPUT_SELECTORS } from '../constants.js';
import type { ChromeClient } from '../types.js';
import { delay } from '../utils.js';

export function isChatgptNewConversationRoute(url: unknown, projectId: string, phase: 'before' | 'after'): boolean {
  if (!/^g-p-[a-f0-9]{32}$/.test(projectId) || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    if (parsed.origin !== 'https://chatgpt.com' || parsed.username || parsed.password || parsed.search || parsed.hash) return false;
    const suffix = phase === 'before' ? 'project' : 'c/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
    return new RegExp(`^/g/${projectId}(?:-[a-z0-9-]+)?/${suffix}/?$`).test(parsed.pathname);
  } catch { return false; }
}

function routeFailure(projectId: string, phase: 'before' | 'after'): BrowserAutomationError {
  return new BrowserAutomationError(`ChatGPT new project conversation ${phase}-submit route could not be verified; refusing replay.`, {
    code: phase === 'before' ? 'chatgpt_new_conversation_precondition_failed' : 'chatgpt_new_conversation_outcome_unknown',
    projectId, phase, retryable: false,
  });
}

export function assertChatgptNewConversationUrl(url: unknown, projectId: string): void {
  if (!isChatgptNewConversationRoute(url, projectId, 'after')) throw routeFailure(projectId, 'after');
}

export function buildChatgptNewConversationProbe(): string {
  return `(() => ({
    url: location.href,
    messageCount: document.querySelectorAll('[data-message-author-role="user"], [data-message-author-role="assistant"]').length,
    promptReady: ${JSON.stringify(INPUT_SELECTORS)}.some(selector => {
      const node = document.querySelector(selector);
      if (!node || node.disabled || node.getAttribute('aria-disabled') === 'true') return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    })
  }))()`;
}

export async function assertChatgptNewConversationDispatch(
  runtime: ChromeClient['Runtime'], projectId: string, phase: 'before' | 'after', timeoutMs = 10_000,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  do {
    const { result } = await runtime.evaluate({ expression: buildChatgptNewConversationProbe(), returnByValue: true });
    const probe = result?.value;
    if (isChatgptNewConversationRoute(probe?.url, projectId, phase)
      && (phase === 'after' || (probe?.messageCount === 0 && probe?.promptReady === true))) return probe.url;
    // Only an unchanged project root may be waiting for route convergence.
    if (phase === 'before' || !isChatgptNewConversationRoute(probe?.url, projectId, 'before')) break;
    await delay(250);
  } while (Date.now() < deadline);
  throw routeFailure(projectId, phase);
}
