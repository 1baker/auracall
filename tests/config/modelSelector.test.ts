import { describe, expect, it } from 'vitest';
import {
  isChatgptSemanticModelSelector,
  resolveChatgptSemanticModelSelector,
} from '../../src/config/modelSelector.js';

describe('semantic model selectors', () => {
  it.each([
    ['chatgpt:auto', { desiredModel: 'GPT-5.6 Terra' }],
    ['chatgpt:terra', { desiredModel: 'GPT-5.6 Terra' }],
    ['chatgpt:gpt-5.6-terra', { desiredModel: 'GPT-5.6 Terra' }],
    ['chatgpt:instant', { desiredModel: 'GPT-5.6 Luna' }],
    ['chatgpt:luna', { desiredModel: 'GPT-5.6 Luna' }],
    ['chatgpt:gpt-5.6-luna', { desiredModel: 'GPT-5.6 Luna' }],
    ['chatgpt:thinking-standard', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' }],
    ['chatgpt:thinking-extended', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'extended' }],
    ['chatgpt:sol', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' }],
    ['chatgpt:sol-medium', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' }],
    ['chatgpt:sol-high', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'extended' }],
    ['chatgpt:sol-extra-high', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'heavy' }],
    ['chatgpt:pro-standard', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'standard' }],
    ['chatgpt:pro-extended', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'extended' }],
    ['chatgpt:sol-pro', { desiredModel: 'GPT-5.6 Sol', thinkingTime: 'heavy' }],
    ['chatgpt:gpt-5.5', { desiredModel: 'GPT-5.5' }],
  ])('resolves %s to current ChatGPT browser controls', (selector, expected) => {
    expect(resolveChatgptSemanticModelSelector(selector)).toEqual(expected);
  });

  it('detects ChatGPT selector typos separately from absent selectors', () => {
    expect(isChatgptSemanticModelSelector('chatgpt:pro-long')).toBe(true);
    expect(resolveChatgptSemanticModelSelector('chatgpt:pro-long')).toBeNull();
    expect(isChatgptSemanticModelSelector('grok:thinking')).toBe(false);
  });
});
