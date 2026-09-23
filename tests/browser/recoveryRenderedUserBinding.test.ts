// biome-ignore-all lint/style/noNonNullAssertion: synthetic message fixtures establish these fields before assertion.
import { runInNewContext } from 'node:vm';
import { expect, test } from 'vitest';
import { bindRecoveredResponse, RECOVERY_RESPONSE_SNAPSHOT } from '../../src/browser/service/recoveryResponseBinding.js';

// Detached DOM fixture mirrors the deidentified live 2026-09-11 structure:
// attachment tile outside content; inline CODE; PRE>CODE with literal sh/text;
// and a Show more button outside content. No browser dependency or live edits.
class Node {
  parentElement: Node | null = null;
  constructor(readonly tag: string, readonly attrs: Record<string, string> = {}, public children: Array<Node | string> = []) {
    for (const child of children) if (child instanceof Node) child.parentElement = this;
  }
  get textContent(): string { return this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
  getAttribute(name: string) { return this.attrs[name] ?? null; }
  cloneNode(): Node { return new Node(this.tag, { ...this.attrs }, this.children.map(child => typeof child === 'string' ? child : child.cloneNode())); }
  querySelectorAll(selector: string): Node[] {
    const descendants = this.children.flatMap(child => child instanceof Node ? [child, ...child.querySelectorAll('*')] : []);
    return descendants.filter(node => selector === '*' || (selector === 'code' && node.tag === 'code')
      || (selector === 'pre > code' && node.tag === 'code' && node.parentElement?.tag === 'pre')
      || (selector === '[data-testid="collapsible-user-message-content"]' && node.attrs['data-testid'] === 'collapsible-user-message-content')
      || (selector.includes('button') && node.tag === 'button')
      || (selector.includes('[aria-hidden="true"]') && node.attrs['aria-hidden'] === 'true'));
  }
  replaceWith(text: string) { const parent = this.parentElement!; parent.children.splice(parent.children.indexOf(this), 1, text); }
  remove() { const parent = this.parentElement!; parent.children.splice(parent.children.indexOf(this), 1); }
}

const tick = '`';
const expected = `Treat ${tick}candidate-thought.md${tick} as authoritative.\n${tick.repeat(3)}sh echo synthetic\n${tick.repeat(3)}\n${tick.repeat(3)}text synthetic result\n${tick.repeat(3)}`;
const content = () => new Node('div', { 'data-testid': 'collapsible-user-message-content' }, [
  new Node('div', {}, ['Treat ', new Node('code', {}, ['candidate-thought.md']), ' as authoritative.']), '\n',
  new Node('pre', {}, [new Node('code', {}, ['sh echo synthetic'])]), '\n',
  new Node('pre', {}, [new Node('code', {}, ['text synthetic result'])]),
]);
const user = (contents: Node[]) => new Node('div', { 'data-message-author-role': 'user', 'data-message-id': 'user-1' }, [
  new Node('div', {}, ['source(20260911-205726).md File']),
  new Node('div', { 'data-testid': 'collapsible-user-message-root' }, [...contents, new Node('button', {}, ['Show more'])]),
]);
function capture(node: Node) {
  const assistant = new Node('div', { 'data-message-author-role': 'assistant', 'data-message-id': 'answer-1' }, [new Node('button', {}, ['final-thought-artifacts.zip'])]);
  return runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, { location: { href: 'https://chatgpt.com/c/test' }, document: {
    querySelector: () => null,
    querySelectorAll: (selector: string) => selector === '[data-message-author-role]' ? [node, assistant] : [],
  } });
}

test('reconstructs exact wire code syntax without attachment chrome or double wrapping and leaves DOM untouched', () => {
  const node = user([content()]);
  const before = node.textContent;
  const snapshot = capture(node);
  expect(snapshot.messages[0].text).toBe(expected);
  expect(node.textContent).toBe(before);
  expect(bindRecoveredResponse(snapshot, expected, 'https://chatgpt.com/c/test')).toMatchObject({ userMessageId: 'user-1', answerMessageId: 'answer-1', answerText: 'final-thought-artifacts.zip' });
  expect(() => bindRecoveredResponse(snapshot, expected.replace('echo synthetic', 'echo different'), 'https://chatgpt.com/c/test')).toThrow();
});

test('rejects multiple user-content roots rather than picking a convenient match', () => {
  expect(() => capture(user([content(), content()]))).toThrow('ambiguous');
});

test('retains existing plain-user fallback without inventing markup', () => {
  const node = new Node('div', { 'data-message-author-role': 'user', 'data-message-id': 'plain' }, ['Plain original request', new Node('button', {}, ['Show more'])]);
  expect(capture(node).messages[0].text).toBe('Plain original request');
});
