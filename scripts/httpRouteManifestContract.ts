import ts from "typescript";
import { HTTP_ROUTE_MANIFEST, type StaticHttpRouteDefinition } from "../src/http/routeManifest.js";

export type HttpRouteManifestContractSources = {
	httpServerText: string;
	httpRouteManifest?: Readonly<Record<string, StaticHttpRouteDefinition>>;
};

const ROUTE_MATCH_FUNCTIONS = new Set(["matchHttpRoutePath", "matchesHttpRoute"]);
const ALLOWED_DYNAMIC_ROUTE_KEY_EXPRESSIONS = new Set(["handoffRoute.key"]);

function sourceLine(sourceFile: ts.SourceFile, node: ts.Node): number {
	return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function isUrlPathname(node: ts.Node, sourceFile: ts.SourceFile): boolean {
	return node.getText(sourceFile) === "url.pathname";
}

function isStaticApiPath(value: string): boolean {
	return value === "/status" || value.startsWith("/status/") || value.startsWith("/v1/");
}

export function collectHttpRouteManifestContractErrors(
	sources: HttpRouteManifestContractSources,
): string[] {
	const errors: string[] = [];
	const manifest: Readonly<Record<string, StaticHttpRouteDefinition>> =
		sources.httpRouteManifest ?? HTTP_ROUTE_MANIFEST;
	const sourceFile = ts.createSourceFile(
		"src/http/responsesServer.ts",
		sources.httpServerText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);
	const referencedKeys = new Set<string>();
	let serverFunction: ts.FunctionDeclaration | undefined;

	const collectReferences = (node: ts.Node): void => {
		if (ts.isFunctionDeclaration(node) && node.name?.text === "createResponsesHttpServer") {
			serverFunction = node;
		}
		if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			ROUTE_MATCH_FUNCTIONS.has(node.expression.text)
		) {
			const keyArgument = node.arguments[0];
			if (!keyArgument) {
				errors.push(
					`src/http/responsesServer.ts:${sourceLine(sourceFile, node)}: route matcher is missing a manifest key`,
				);
			} else if (ts.isStringLiteral(keyArgument)) {
				referencedKeys.add(keyArgument.text);
				if (!manifest[keyArgument.text]) {
					errors.push(
						`src/http/responsesServer.ts:${sourceLine(sourceFile, keyArgument)}: unknown route manifest key ${keyArgument.text}`,
					);
				}
			} else {
				const expression = keyArgument.getText(sourceFile);
				if (!ALLOWED_DYNAMIC_ROUTE_KEY_EXPRESSIONS.has(expression)) {
					errors.push(
						`src/http/responsesServer.ts:${sourceLine(sourceFile, keyArgument)}: unsupported dynamic route manifest key ${expression}`,
					);
				}
			}
		}
		ts.forEachChild(node, collectReferences);
	};
	collectReferences(sourceFile);

	for (const key of Object.keys(manifest)) {
		if (!referencedKeys.has(key)) {
			errors.push(`src/http/responsesServer.ts: missing handler reference for ${key}`);
		}
	}

	if (!serverFunction) {
		errors.push("src/http/responsesServer.ts: missing createResponsesHttpServer authority");
		return errors;
	}

	const inspectHandlerGate = (node: ts.Node): void => {
		if (ts.isBinaryExpression(node)) {
			const operator = node.operatorToken.kind;
			if (
				operator === ts.SyntaxKind.EqualsEqualsEqualsToken ||
				operator === ts.SyntaxKind.EqualsEqualsToken
			) {
				const literal = ts.isStringLiteral(node.left)
					? node.left
					: ts.isStringLiteral(node.right)
						? node.right
						: null;
				const pathname = literal === node.left ? node.right : node.left;
				if (literal && isStaticApiPath(literal.text) && isUrlPathname(pathname, sourceFile)) {
					errors.push(
						`src/http/responsesServer.ts:${sourceLine(sourceFile, node)}: raw API path equality bypasses route manifest (${literal.text})`,
					);
				}
			}
		}
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			node.expression.name.text === "startsWith" &&
			isUrlPathname(node.expression.expression, sourceFile)
		) {
			const prefix = node.arguments[0];
			if (prefix && ts.isStringLiteral(prefix) && isStaticApiPath(prefix.text)) {
				errors.push(
					`src/http/responsesServer.ts:${sourceLine(sourceFile, node)}: raw API path prefix bypasses route manifest (${prefix.text})`,
				);
			}
		}
		if (
			ts.isRegularExpressionLiteral(node) &&
			(/\\\/v1\\\//u.test(node.text) || /\\\/status(?:\\\/|\$)/u.test(node.text))
		) {
			errors.push(
				`src/http/responsesServer.ts:${sourceLine(sourceFile, node)}: raw API route regular expression bypasses route manifest`,
			);
		}
		ts.forEachChild(node, inspectHandlerGate);
	};
	inspectHandlerGate(serverFunction);

	return errors;
}
