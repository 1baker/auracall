import type { ThinkingTimeLevel } from '../browser/types.js';

export interface ChatgptSemanticModelSelection {
  desiredModel: 'Auto' | 'Instant' | 'Thinking' | 'Pro';
  thinkingTime?: ThinkingTimeLevel;
}

export interface SemanticModelSelectorDescriptor {
  id: string;
  service: 'chatgpt' | 'gemini' | 'grok';
  label: string;
  executionReady: boolean;
}

const CHATGPT_SELECTOR_PREFIX = 'chatgpt:';

export const SEMANTIC_MODEL_SELECTORS: readonly SemanticModelSelectorDescriptor[] = [
  { id: 'chatgpt:auto', service: 'chatgpt', label: 'ChatGPT Auto', executionReady: true },
  { id: 'chatgpt:instant', service: 'chatgpt', label: 'ChatGPT Instant', executionReady: true },
  {
    id: 'chatgpt:thinking-standard',
    service: 'chatgpt',
    label: 'ChatGPT Thinking Standard',
    executionReady: true,
  },
  {
    id: 'chatgpt:thinking-extended',
    service: 'chatgpt',
    label: 'ChatGPT Thinking Extended',
    executionReady: true,
  },
  {
    id: 'chatgpt:sol-medium',
    service: 'chatgpt',
    label: 'ChatGPT Sol Medium',
    executionReady: true,
  },
  {
    id: 'chatgpt:sol-high',
    service: 'chatgpt',
    label: 'ChatGPT Sol High',
    executionReady: true,
  },
  {
    id: 'chatgpt:sol-extra-high',
    service: 'chatgpt',
    label: 'ChatGPT Sol Extra High',
    executionReady: true,
  },
  {
    id: 'chatgpt:pro-standard',
    service: 'chatgpt',
    label: 'ChatGPT Pro Standard',
    executionReady: true,
  },
  {
    id: 'chatgpt:pro-extended',
    service: 'chatgpt',
    label: 'ChatGPT Pro Extended',
    executionReady: true,
  },
  {
    id: 'chatgpt:sol-pro',
    service: 'chatgpt',
    label: 'ChatGPT Sol Pro',
    executionReady: true,
  },
  { id: 'gemini:auto', service: 'gemini', label: 'Gemini Auto', executionReady: false },
  { id: 'gemini:instant', service: 'gemini', label: 'Gemini Instant', executionReady: false },
  { id: 'gemini:thinking', service: 'gemini', label: 'Gemini Thinking', executionReady: false },
  { id: 'grok:auto', service: 'grok', label: 'Grok Auto', executionReady: false },
  { id: 'grok:instant', service: 'grok', label: 'Grok Instant', executionReady: false },
  { id: 'grok:thinking', service: 'grok', label: 'Grok Thinking', executionReady: false },
];

export function resolveChatgptSemanticModelSelector(
  value: unknown,
): ChatgptSemanticModelSelection | null {
  const selector = normalizeSelector(value);
  if (!selector) {
    return null;
  }
  const token = selector.startsWith(CHATGPT_SELECTOR_PREFIX)
    ? selector.slice(CHATGPT_SELECTOR_PREFIX.length)
    : selector;

  switch (token) {
    case 'auto':
      return { desiredModel: 'Auto' };
    case 'instant':
      return { desiredModel: 'Instant' };
    case 'thinking':
    case 'thinking-standard':
    case 'sol':
    case 'sol-medium':
    case 'gpt-5.6-sol':
      return { desiredModel: 'Thinking', thinkingTime: 'standard' };
    case 'thinking-extended':
    case 'sol-high':
    case 'gpt-5.6-sol-high':
      return { desiredModel: 'Thinking', thinkingTime: 'extended' };
    case 'sol-extra-high':
    case 'gpt-5.6-sol-extra-high':
      return { desiredModel: 'Thinking', thinkingTime: 'heavy' };
    case 'pro':
    case 'pro-standard':
      return { desiredModel: 'Pro', thinkingTime: 'standard' };
    case 'pro-extended':
      return { desiredModel: 'Pro', thinkingTime: 'extended' };
    case 'sol-pro':
    case 'gpt-5.6-sol-pro':
      return { desiredModel: 'Pro' };
    default:
      return null;
  }
}

export function isChatgptSemanticModelSelector(value: unknown): boolean {
  const selector = normalizeSelector(value);
  return selector ? selector.startsWith(CHATGPT_SELECTOR_PREFIX) : false;
}

function normalizeSelector(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}
