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

/**
 * Handles the extraction of elements from a given URL based on the provided selector and type.
 * @param {Context} c - The Hono context object containing the request data.
 * @returns {Promise<singleReturnType | multipleReturnType>} A promise that resolves to the extracted data or an error message.
 */
const extract = async (c: Context) => {
	// Validate the input data
	const { err, data } = await val(c, "extract");
	if (data === null) return c.json({ err, data: null });

	// Read the DOM from the provided URL
	const { err: errDom, data: doc } = await dom.readDOM(data.url);
	if (errDom !== null) return c.json({ err: errDom, data: null });

	// Check if the extraction type is provided
	if (data.type === undefined)
		return c.json({ err: "data.type missing", data: null });

	// Perform the extraction based on the type
	const { err: errExtract, data: extractedData } = [
		"link",
		"text",
		"node",
	].includes(data.type)
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
	return c.json({ err: null, data: extractedData });
};

export default extract;
