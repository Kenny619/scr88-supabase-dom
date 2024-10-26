import type { Context } from "jsr:@hono/hono/";
import val from "../utils/validators.ts";
import * as dom from "../utils/dom.ts";
import { extractAllFromDOM } from "../utils/dom.ts";

const extractAll = async (c: Context) => {
	//validate URL
	const { err, data } = await val(c, "selector");
	if (data === null) return c.json({ err, data: null });

	//read DOM
	const { err: errDom, data: doc } = await dom.readDOM(data.url);
	if (errDom !== null) return c.json({ err: errDom, data: null });

	//get index links
	const { err: errExtract, data: links } = extractAllFromDOM(
		data.type,
		data.selector as string,
		doc as string,
	);
	if (errExtract !== null) return c.json({ err: errExtract, data: null });
	return c.json({ err: null, data: links });
};

export default extractAll;
