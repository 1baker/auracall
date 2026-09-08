import { describe, expect, it } from 'vitest';
import { createResponseArtifactExclusion } from '../src/runtime/responseArtifactScope.js';
import { verifiedAssistantMessageId } from '../src/browser/actions/assistantResponse.js';

describe('response artifact ownership', () => {
  it('binds identity only to the captured text and never to the prior message', () => {
    const captured = { text: 'Files ready', meta: { messageId: 'new' } };
    expect(verifiedAssistantMessageId('Files  ready', captured, 'old')).toBe('new');
    expect(verifiedAssistantMessageId('Different output', captured, 'old')).toBeNull();
    expect(verifiedAssistantMessageId('Files ready', captured, 'new')).toBeNull();
    expect(verifiedAssistantMessageId('Files ready', { ...captured, meta: {} }, 'old')).toBeNull();
  });
  it('excludes old same-name and same-URL files while retaining exact current-message files', () => {
    const exclude = createResponseArtifactExclusion('current-message');
    const common = { title: 'final-thought.docx', uri: 'sandbox:/mnt/data/final-thought.docx' };
    expect(exclude({ ...common, id: 'old', messageId: 'old-message' })).toBe(true);
    expect(exclude({ ...common, id: 'current', messageId: 'current-message' })).toBe(false);
    expect(exclude({ ...common, id: 'unknown', messageIndex: 1000 })).toBe(true);
    expect(exclude({ ...common, id: 'metadata-only', metadata: { messageId: 'current-message' } })).toBe(true);
  });

  it.each([null, undefined, '', '   '])('rejects missing captured identity %s', (id) => {
    expect(() => createResponseArtifactExclusion(id)).toThrow('exact assistant message id');
  });

  it('normalizes whitespace but does not accept partial identifiers', () => {
    const exclude = createResponseArtifactExclusion(' current-message ');
    expect(exclude({ id: 'one', title: 'file', messageId: ' current-message ' })).toBe(false);
    expect(exclude({ id: 'two', title: 'file', messageId: 'current-message-extra' })).toBe(true);
  });
});
