const ABSOLUTE_CHECKOUT_LINK = /\[[^\]]*\]\((\/(?:home|Users|mnt\/[a-zA-Z])\/[^)\s]+)\)/gu;

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
