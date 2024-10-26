import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

/**
 * Fetches the HTML content of a given URL and returns the body of the parsed DOM.
 * @param {string} url - The URL to fetch and parse.
 * @returns {Promise<{ err: string | null; data: string | null }>} An object containing either the parsed body HTML or an error message.
 */
export const readDOM = async (
	url: string,
): Promise<{ err: string | null; data: string | null }> => {
	try {
		// Fetch the URL with a timeout to prevent hanging
		const res = await fetch(url, {
			signal: AbortSignal.timeout(3000),
		});
		const html = await res.text();

		// Parse the HTML and extract the body content
		const doc = new DOMParser().parseFromString(html, "text/html");
		const body = doc.getElementsByTagName("body")[0];

		// Return the body's outer HTML if it exists, otherwise return an error
		return body
			? { err: null, data: body.outerHTML }
			: { err: "No body found in the document", data: null };
	} catch (e) {
		return { err: JSON.stringify(e), data: null };
	}
};

/**
 * Extracts a single element from the DOM based on the given type and selector.
 * @param {("link" | "text" | "node")} type - The type of content to extract.
 * @param {string} selector - The CSS selector to use for finding the element.
 * @param {string} doc - The HTML string to parse and extract from.
 * @returns {{ err: string; data: null } | { err: null; data: string }} An object containing either the extracted content or an error message.
 */
export const extractFromDOM = (
	type: "link" | "text" | "node",
	selector: string,
	doc: string,
): { err: string; data: null } | { err: null; data: string } => {
	const dom = new DOMParser().parseFromString(doc, "text/html");
	const el = dom.querySelector(selector);

	if (!el) {
		return {
			err: `querySelector failed. Selector "${selector}" found no match.`,
			data: null,
		};
	}

	let extracted = "";

	// Extract the appropriate content based on the type
	switch (type) {
		case "link":
			extracted = el.getAttribute("href") || "";
			break;
		case "text":
			extracted = el.textContent || "";
			break;
		case "node":
			extracted = el.outerHTML;
			break;
	}

	if (!extracted) {
		return {
			err: `extractFromDOM failed. Selector "${selector}" returned no ${type}.`,
			data: null,
		};
	}
	return { err: null, data: extracted };
};

/**
 * Extracts multiple elements from the DOM based on the given type and selector.
 * @param {("links" | "texts" | "nodes")} type - The type of content to extract.
 * @param {string} selector - The CSS selector to use for finding the elements.
 * @param {string} doc - The HTML string to parse and extract from.
 * @returns {{ err: string; data: null } | { err: null; data: string[] }} An object containing either an array of extracted content or an error message.
 */
export const extractAllFromDOM = (
	type: "links" | "texts" | "nodes",
	selector: string,
	doc: string,
): { err: string; data: null } | { err: null; data: string[] } => {
	const dom = new DOMParser().parseFromString(doc, "text/html");
	const nodes = dom.querySelectorAll(selector);
	if (nodes.length === 0) {
		return {
			err: `querySelectorAll failed. Selector "${selector}" returned no elements`,
			data: null,
		};
	}

	// Extract valid Elements from nodes
	const elems = Array.from(nodes).filter((el): el is Element => el !== null);

	let r: string[] = [];

	// Extract the appropriate content based on the type
	switch (type) {
		case "links":
			r = elems
				.map((el) => el.getAttribute("href"))
				.filter((href): href is string => href !== null);
			break;
		case "texts":
			r = elems
				.map((el) => el.textContent)
				.filter((text): text is string => text !== null);
			break;
		case "nodes":
			r = elems.map((el) => el.outerHTML);
			break;
	}

	if (r.length === 0) {
		return {
			err: `extractAllFromDOM failed. Selector "${selector}" returned no ${type}.`,
			data: null,
		};
	}
	return { err: null, data: r };
};
