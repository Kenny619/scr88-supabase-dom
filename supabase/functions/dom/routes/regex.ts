import type { Context } from "jsr:@hono/hono/";
import val from "../utils/validators.ts";
import * as dom from "../utils/dom.ts";

const regex = async (c: Context) => {
	//validate URL
	const { err, data } = await val(c, "selector");
	if (data === null) return c.json({ err, data: null });

	//read DOM
	const { err: errDom, data: doc } = await dom.readDOM(data.url);
	if (errDom !== null) return c.json({ err: errDom, data: null });

	try {
		const regex = new RegExp(data.selector as string);
		const match = regex.exec(doc as string);

		return match
			? c.json({ err: null, data: match[1] })
			: c.json({ err: `Invalid regex ${data.selector}`, data: null });
	} catch (e) {
		return c.json({
			err: `Invalid regex ${data.selector} ERROR: ${e}`,
			data: null,
		});
	}
};

export default regex;
