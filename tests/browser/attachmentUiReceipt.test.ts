import { describe, expect, it } from "vitest";
import { buildChatgptAttachmentUiReceipt } from "../../src/browser/attachmentUiReceipt.js";

const attachments = [
	{ path: "/tmp/review-a.md", displayPath: "review-a.md" },
	{ path: "/tmp/review-b.md", displayPath: "review-b.md" },
];

describe("ChatGPT attachment UI receipt", () => {
	it("records exact submitted paths only when upload and sent-turn UI were confirmed", () => {
		expect(
			buildChatgptAttachmentUiReceipt({
				attachments,
				uploadTimedOut: false,
				inputOnlyAttachments: false,
				sentUserTurnAttachmentsConfirmed: true,
				submittedUserId: "user-123",
			}),
		).toEqual({
			schema: "auracall.browser_attachment_ui_receipt.v1",
			attachmentPaths: ["/tmp/review-a.md", "/tmp/review-b.md"],
			uploadCompletion: "confirmed",
			sentUserTurnAttachments: "confirmed",
			submittedUserId: "user-123",
		});
	});

	it.each([
		[true, false, "timed_out", "skipped_upload_timeout"],
		[false, true, "confirmed", "skipped_input_only"],
	] as const)("keeps unconfirmed upload state explicit", (uploadTimedOut, inputOnlyAttachments, uploadCompletion, sentUserTurnAttachments) => {
		expect(
			buildChatgptAttachmentUiReceipt({
				attachments,
				uploadTimedOut,
				inputOnlyAttachments,
				sentUserTurnAttachmentsConfirmed: false,
				submittedUserId: null,
			}),
		).toMatchObject({ uploadCompletion, sentUserTurnAttachments, submittedUserId: null });
	});

	it("does not create an attachment receipt for a text-only turn", () => {
		expect(
			buildChatgptAttachmentUiReceipt({
				attachments: [],
				uploadTimedOut: false,
				inputOnlyAttachments: false,
				sentUserTurnAttachmentsConfirmed: false,
				submittedUserId: "user-123",
			}),
		).toBeUndefined();
	});

	it("rejects contradictory confirmation states", () => {
		expect(() =>
			buildChatgptAttachmentUiReceipt({
				attachments,
				uploadTimedOut: true,
				inputOnlyAttachments: false,
				sentUserTurnAttachmentsConfirmed: true,
				submittedUserId: "user-123",
			}),
		).toThrow(/conflicts/);
	});
});
