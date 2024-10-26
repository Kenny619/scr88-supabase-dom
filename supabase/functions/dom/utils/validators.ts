import type { Context } from "jsr:@hono/hono/";
import { z } from "npm:zod";

/**
 * Schema definitions for input validation
 */
const schema = {
	url: z.object({
		url: z.string().url({ message: "Invalid URL" }),
	}),
	selector: z.object({
		url: z.string().url({ message: "Invalid URL" }),
		selector: z.string({ message: "Invalid selector" }),
	}),
	extract: z.object({
		url: z.string().url({ message: "Invalid URL" }),
		selector: z.string({ message: "Invalid selector" }),
		type: z.enum(["link", "text", "node", "links", "texts", "nodes"]),
	}),
	lastUrl: z.object({
		url: z.string().url({ message: "Invalid URL" }),
		selector: z.string({ message: "Invalid selector" }),
		regex: z.string({ message: "Invalid regex" }),
	}),
} as const;

type SchemaName = Readonly<keyof typeof schema>;
type zodParseResult<s extends SchemaName> = Readonly<
	s extends "url"
		? { url: string }
		: s extends "selector"
			? { url: string; selector: string }
			: s extends "extract"
				? {
						url: string;
						selector: string;
						type: "link" | "text" | "node" | "links" | "texts" | "nodes";
					}
				: s extends "lastUrl"
					? { url: string; selector: string; regex: string }
					: never
>;

/**
 * Validates the input data based on the specified schema.
 * @param {Context} c - The Hono context object containing the request data.
 * @param {keyof typeof schema} schemaName - The name of the schema to use for validation.
 * @returns {Promise<{ err: string | null; data: { url: string; selector?: string; type?: "link" | "text" | "node" | "links" | "texts" | "nodes"; } | null }>}
 */
const val = async <s extends SchemaName>(
	c: Context,
	schemaName: s,
): Promise<
	{ err: null; data: zodParseResult<s> } | { err: string; data: null }
> => {
	try {
		// Parse and validate the input data
		const input = schema[schemaName as s].parse(
			await c.req.json(),
		) as zodParseResult<s>;

		// Check if the URL is reachable
		const res = await fetch(input.url, { signal: AbortSignal.timeout(3000) });
		return res.ok
			? { err: null, data: input }
			: { err: "URL unreachable", data: null };
	} catch (e) {
		// Handle validation errors
		if (e instanceof z.ZodError) {
			return { err: e.message, data: null };
		}
		return { err: e.message, data: null };
	}
};

export default val;
