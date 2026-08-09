#!/usr/bin/env tsx
import { pathToFileURL } from "node:url";
import { runAgentBrowserNetworkMetadata } from "../../src/browser/diagnostics/agentBrowserNetworkMetadata.js";

interface ParsedArguments {
	session: string;
	cdpPort: number;
	requestId?: string;
	expectedUrl: string;
	discoveryTimeoutMs?: number;
	timeoutMs?: number;
	maxOutputBytes?: number;
}

const readValue = (args: string[], index: number): string => {
	const value = args[index + 1];
	if (!value || value.startsWith("--")) {
		throw new Error("Missing option value.");
	}
	return value;
};

export function parseAgentBrowserNetworkMetadataArguments(args: string[]): ParsedArguments {
	const values: Partial<ParsedArguments> = {};
	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];
		switch (argument) {
			case "--session":
				values.session = readValue(args, index);
				index += 1;
				break;
			case "--cdp":
				values.cdpPort = Number(readValue(args, index));
				index += 1;
				break;
			case "--request-id":
				values.requestId = readValue(args, index);
				index += 1;
				break;
			case "--expected-url":
				values.expectedUrl = readValue(args, index);
				index += 1;
				break;
			case "--discovery-timeout-ms":
				values.discoveryTimeoutMs = Number(readValue(args, index));
				index += 1;
				break;
			case "--timeout-ms":
				values.timeoutMs = Number(readValue(args, index));
				index += 1;
				break;
			case "--max-output-bytes":
				values.maxOutputBytes = Number(readValue(args, index));
				index += 1;
				break;
			default:
				throw new Error("Unknown option.");
		}
	}

	if (!values.session || !values.expectedUrl || !values.cdpPort) {
		throw new Error("Missing required option.");
	}
	return values as ParsedArguments;
}

export async function main(args = process.argv.slice(2)): Promise<void> {
	try {
		const options = parseAgentBrowserNetworkMetadataArguments(args);
		const result = await runAgentBrowserNetworkMetadata(options);
		process.stdout.write(`${JSON.stringify(result)}\n`);
	} catch {
		process.stdout.write(`${JSON.stringify({ outcome: "invalid_arguments" })}\n`);
		process.exitCode = 2;
	}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	void main();
}
