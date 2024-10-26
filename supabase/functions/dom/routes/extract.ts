import type { Context } from "jsr:@hono/hono/";
import val from "../utils/validators.ts";
import * as dom from "../utils/dom.ts";
import { extractFromDOM, extractAllFromDOM } from "../utils/dom.ts";

type singleType = "link" | "text" | "node";
type multipleType = "links" | "texts" | "nodes";
type singleReturnType =
	| { err: string; data: null }
	| { err: null; data: string };
type multipleReturnType =
	| { err: string; data: null }
	| { err: null; data: string[] };
type extractType = singleType | multipleType;
type Extract = <T extends extractType>(
	c: Context,
) => Promise<T extends singleType ? singleReturnType : multipleReturnType>;

const extract = async (c: Context) => {
	const { err, data } = await val(c, "extract");
	if (data === null) return c.json({ err, data: null });

	//read DOM
	const { err: errDom, data: doc } = await dom.readDOM(data.url);
	if (errDom !== null) return c.json({ err: errDom, data: null });

	//get index links
	if (data.type === undefined)
		return c.json({ err: "data.type missing", data: null });
	const { err: errExtract, data: links } = ["link", "text", "node"].includes(
		data.type,
	)
		? extractFromDOM(
				data.type as singleType,
				data.selector as string,
				doc as string,
			)
		: extractAllFromDOM(
				data.type as multipleType,
				data.selector as string,
				doc as string,
			);
	if (errExtract !== null) return c.json({ err: errExtract, data: null });
	return c.json({ err: null, data: links });
};

export default extract;
