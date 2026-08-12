import { describe, expect, it } from 'vitest';
import { ChatgptServiceConfigSchema } from '../../src/schema/types.js';

describe('ChatGPT mode config schema', () => {
  it('accepts explicit Chat and Work mode with a separate Work model', () => {
    expect(ChatgptServiceConfigSchema.parse({ chatgptMode: 'chat' })).toEqual({
      chatgptMode: 'chat',
    });
    expect(ChatgptServiceConfigSchema.parse({ chatgptMode: 'work', workModel: 'Research' })).toEqual({
      chatgptMode: 'work',
      workModel: 'Research',
    });
  });

  it('rejects unknown ChatGPT modes', () => {
    expect(() => ChatgptServiceConfigSchema.parse({ chatgptMode: 'agent' })).toThrow();
  });
});
