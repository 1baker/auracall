const ABSOLUTE_CHECKOUT_LINK = /\[[^\]]*\]\((\/(?:home|Users|mnt\/[a-zA-Z])\/[^)\s]+)\)/gu;
const RETIRED_AURACALL_CHECKOUT = '/home/ecochran76/workspace.local/auracall';
const POSIX_USER_HOME = /\/(?:home|Users)\/(<[^/\\\s"'`<>]+>|[^/\\\s"'`<>]+)/gu;
const WINDOWS_USER_HOME = /\\+Users\\+(<[^/\\\s"'`<>]+>|[^/\\\s"'`<>]+)/gu;
const GENERIC_USER_SEGMENTS = new Set([
  'you',
  'me',
  'user',
  'username',
  'name',
  'example',
  'sample',
  '$user',
  `\${user}`,
  '%username%',
  'shared',
  'public',
  'default',
]);

export function collectAbsoluteCheckoutMarkdownLinks(markdownText: string): string[] {
  return Array.from(
    new Set(Array.from(markdownText.matchAll(ABSOLUTE_CHECKOUT_LINK), (match) => match[1])),
  );
}

export function collectCurrentDocAbsoluteLinkErrors(
  documents: ReadonlyArray<{ path: string; text: string }>,
): string[] {
  return documents.flatMap((document) =>
    collectAbsoluteCheckoutMarkdownLinks(document.text).map(
      (target) => `${document.path}: absolute checkout Markdown link ${target}`,
    ),
  );
}

export function collectCurrentDocRetiredCheckoutErrors(
  documents: ReadonlyArray<{ path: string; text: string }>,
): string[] {
  return documents
    .filter((document) => document.text.includes(RETIRED_AURACALL_CHECKOUT))
    .map(
      (document) =>
        `${document.path}: contains retired checkout path ${RETIRED_AURACALL_CHECKOUT}`,
    );
}

function isGenericUserSegment(segment: string): boolean {
  return GENERIC_USER_SEGMENTS.has(segment.replace(/^<|>$/gu, '').toLowerCase());
}

export function collectConcreteUserHomeRoots(markdownText: string): string[] {
  const matches = [
    ...markdownText.matchAll(POSIX_USER_HOME),
    ...markdownText.matchAll(WINDOWS_USER_HOME),
  ];
  return Array.from(
    new Set(
      matches
        .filter((match) => !isGenericUserSegment(match[1] ?? ''))
        .map((match) => match[0]),
    ),
  );
}

export function collectCurrentDocConcreteUserPathErrors(
  documents: ReadonlyArray<{ path: string; text: string }>,
): string[] {
  return documents.flatMap((document) =>
    collectConcreteUserHomeRoots(document.text).map(
      (root) => `${document.path}: concrete user-home path ${root}`,
    ),
  );
}
