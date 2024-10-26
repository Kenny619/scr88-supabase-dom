import type { Context } from "jsr:@hono/hono/";
import val from "../utils/validators.ts";
import { readDOM, extractFromDOM } from "../utils/dom.ts";

const lastPageNumber = async (c: Context) => {
	//validate URL
	const { err, data } = await val(c, "lastUrl");
	if (data === null) return c.json({ err, data: null });

	//read DOM
	const { err: errDom, data: doc } = await readDOM(data.url);
	if (errDom !== null) return c.json({ err: errDom, data: null });

	//get last link
	const { err: errExtract, data: lastUrl } = extractFromDOM(
		"link",
		data.selector as string,
		doc as string,
	);
	if (errExtract !== null) return c.json({ err: errExtract, data: null });

	try {
		const r = new RegExp(data.regex as string);
		const match = r.exec(lastUrl as string);
		return match
			? c.json({ err: null, data: match[1] })
			: c.json({
					err: `regex ${data.regex} returned no match on ${lastUrl}`,
					data: null,
				});
	} catch (e) {
		return c.json({
			err: `Invalid regex ${data.regex} ERROR: ${e}`,
			data: null,
		});
	}
};

export default lastPageNumber;
