import type { ThinkingTimeLevel } from '../browser/types.js';

export interface ChatgptSemanticModelSelection {
  desiredModel: 'GPT-5.6 Sol' | 'GPT-5.6 Terra' | 'GPT-5.6 Luna' | 'GPT-5.5';
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
  { id: 'chatgpt:auto', service: 'chatgpt', label: 'ChatGPT Auto (Terra)', executionReady: true },
  {
    id: 'chatgpt:instant',
    service: 'chatgpt',
    label: 'ChatGPT Instant (Luna)',
    executionReady: true,
  },
  { id: 'chatgpt:sol', service: 'chatgpt', label: 'ChatGPT GPT-5.6 Sol', executionReady: true },
  { id: 'chatgpt:terra', service: 'chatgpt', label: 'ChatGPT GPT-5.6 Terra', executionReady: true },
  { id: 'chatgpt:luna', service: 'chatgpt', label: 'ChatGPT GPT-5.6 Luna', executionReady: true },
  { id: 'chatgpt:gpt-5.5', service: 'chatgpt', label: 'ChatGPT GPT-5.5', executionReady: true },
  {
    id: 'chatgpt:thinking-standard',
    service: 'chatgpt',
    label: 'ChatGPT Thinking Standard (Sol Medium)',
    executionReady: true,
  },
  {
    id: 'chatgpt:thinking-extended',
    service: 'chatgpt',
    label: 'ChatGPT Thinking Extended (Sol High)',
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
    label: 'ChatGPT Legacy Pro Standard (Sol Medium)',
    executionReady: true,
  },
  {
    id: 'chatgpt:pro-extended',
    service: 'chatgpt',
    label: 'ChatGPT Legacy Pro Extended (Sol High)',
    executionReady: true,
  },
  {
    id: 'chatgpt:sol-pro',
    service: 'chatgpt',
    label: 'ChatGPT Legacy Sol Pro (Sol Extra High)',
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
    case 'terra':
    case 'gpt-5.6-terra':
      return { desiredModel: 'GPT-5.6 Terra' };
    case 'instant':
    case 'luna':
    case 'gpt-5.6-luna':
      return { desiredModel: 'GPT-5.6 Luna' };
    case 'thinking':
    case 'thinking-standard':
    case 'sol':
    case 'sol-medium':
    case 'gpt-5.6-sol':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' };
    case 'thinking-extended':
    case 'sol-high':
    case 'gpt-5.6-sol-high':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'extended' };
    case 'sol-extra-high':
    case 'gpt-5.6-sol-extra-high':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'heavy' };
    case 'pro':
    case 'pro-standard':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' };
    case 'pro-extended':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'extended' };
    case 'sol-pro':
    case 'gpt-5.6-sol-pro':
      return { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'heavy' };
    case 'gpt-5.5':
    case '5.5':
      return { desiredModel: 'GPT-5.5' };
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
