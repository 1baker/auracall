import type { ConversationArtifact } from '../browser/providers/domain.js';

/** Exact ownership only: filenames, URLs and virtualized turn indexes are not identities. */
export function createResponseArtifactExclusion(messageId: string | null | undefined) {
  const expected = messageId?.trim();
  if (!expected) {
    throw new Error('response artifact materialization requires an exact assistant message id');
  }
  return (artifact: ConversationArtifact): boolean => artifact.messageId?.trim() !== expected;
}
