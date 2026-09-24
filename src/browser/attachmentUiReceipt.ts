import type { BrowserAttachment, BrowserAttachmentUiReceipt } from "./types.js";

/** Record what the browser UI observed, without claiming provider file consumption. */
export function buildChatgptAttachmentUiReceipt(input: {
	attachments: BrowserAttachment[];
	uploadTimedOut: boolean;
	inputOnlyAttachments: boolean;
	sentUserTurnAttachmentsConfirmed: boolean;
	submittedUserId: string | null;
}): BrowserAttachmentUiReceipt | undefined {
	if (input.attachments.length === 0) return undefined;
	if (
		input.sentUserTurnAttachmentsConfirmed &&
		(input.uploadTimedOut || input.inputOnlyAttachments)
	) {
		throw new Error(
			"Sent-turn attachment confirmation conflicts with skipped upload verification.",
		);
	}
	return {
		schema: "auracall.browser_attachment_ui_receipt.v1",
		attachmentPaths: input.attachments.map((attachment) => attachment.path),
		uploadCompletion: input.uploadTimedOut ? "timed_out" : "confirmed",
		sentUserTurnAttachments: input.sentUserTurnAttachmentsConfirmed
			? "confirmed"
			: input.uploadTimedOut
				? "skipped_upload_timeout"
				: "skipped_input_only",
		submittedUserId: input.submittedUserId,
	};
}
