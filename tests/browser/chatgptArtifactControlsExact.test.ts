import { expect, test } from 'vitest';
import { resolveChatgptArtifactControlCandidate, type ChatgptArtifactControlCandidate } from '../../src/browser/providers/chatgptArtifactControls.js';

const expected = { title: 'final-thought.docx', uri: 'chatgpt://download-button/turn/0', uriFileName: '0', turnId: 'turn', messageId: 'assistant', messageIndex: 4, buttonIndex: 0 };
const control = (title: string, buttonIndex: number): ChatgptArtifactControlCandidate => ({ title, buttonIndex, href: '', turnId: 'turn', messageId: 'assistant', messageIndex: 4 });

test('selects unique exact DOCX after button reorder instead of prefix-matching ZIP at old index', () => {
  const zip = control('final-thought-artifacts.zip', 0);
  const docx = control('final-thought.docx', 2);
  expect(resolveChatgptArtifactControlCandidate(expected, [zip, control('final-thought.pdf', 1), docx])).toBe(docx);
  expect(resolveChatgptArtifactControlCandidate(expected, [zip])).toBeNull();
});

test.each(['final-thought.pdf', 'final-thought.docx.zip', 'final-thought-older.docx', 'final-thought', 'final-thought(20260911-210349).docx', 'final-thought.docx extra'])('rejects changed or incomplete filename %s', title => {
  expect(resolveChatgptArtifactControlCandidate(expected, [control(title, 0)])).toBeNull();
});

test('rejects ambiguous same-name controls instead of using index or first candidate', () => {
  expect(resolveChatgptArtifactControlCandidate(expected, [control('final-thought.docx', 0), control('final-thought.docx', 1)])).toBeNull();
});

test('does not cross either stable turn or message ownership', () => {
  expect(resolveChatgptArtifactControlCandidate(expected, [{ ...control('final-thought.docx', 0), messageId: 'other' }])).toBeNull();
  expect(resolveChatgptArtifactControlCandidate(expected, [{ ...control('final-thought.docx', 0), turnId: 'other' }])).toBeNull();
});

test('does not let URI equality override a contradictory filename', () => {
  expect(resolveChatgptArtifactControlCandidate({ ...expected, uri: 'sandbox:/mnt/data/final-thought.docx' }, [{ ...control('final-thought-artifacts.zip', 0), href: 'sandbox:/mnt/data/final-thought.docx' }])).toBeNull();
});

test('retains index constraint when no stable ownership exists and remains serializable for DOM use', () => {
  const withoutIdentity = { ...expected, turnId: null, messageId: null };
  expect(resolveChatgptArtifactControlCandidate(withoutIdentity, [control('final-thought.docx', 2)])).toBeNull();
  const invoke = new Function('expected', 'candidates', `return (${resolveChatgptArtifactControlCandidate.toString()})(expected, candidates)`);
  expect(invoke(expected, [control('final-thought.docx', 2)])).toMatchObject({ title: 'final-thought.docx', buttonIndex: 2 });
});
