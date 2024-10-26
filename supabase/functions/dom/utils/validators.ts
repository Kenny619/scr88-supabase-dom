import type { Context } from "jsr:@hono/hono/";
import { z } from "npm:zod";

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
};

export const val = async (
	c: Context,
	schemaName: keyof typeof schema,
): Promise<{
	err: string | null;
	data: {
		url: string;
		selector?: string;
		type?: "link" | "text" | "node" | "links" | "texts" | "nodes";
	} | null;
}> => {
	//validate passed url
	try {
		const input = schema[schemaName].parse(await c.req.json());
		const res = await fetch(input.url, { signal: AbortSignal.timeout(3000) });
		return res.ok
			? { err: null, data: input }
			: { err: "URL unreachable", data: null };
	} catch (e) {
		if (e instanceof z.ZodError) {
			return { err: e.message, data: null };
		}
		return { err: e.message, data: null };
	}
};

export default val;
