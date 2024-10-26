import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

export const readDOM = async (
	url: string,
): Promise<{ err: string | null; data: string | null }> => {
	try {
		const res = await fetch(url, {
			signal: AbortSignal.timeout(3000),
		});
		const html = await res.text();
		const doc = new DOMParser().parseFromString(html, "text/html");
		return { err: null, data: doc.getElementsByTagName("body")[0].outerHTML };
	} catch (e) {
		return { err: JSON.stringify(e), data: null };
	}
};
export const extractFromDOM = (
	type: "link" | "text" | "node",
	selector: string,
	doc: string,
): { err: string; data: null } | { err: null; data: string } => {
	const dom = new DOMParser().parseFromString(doc, "text/html");
	const el = dom.querySelector(selector);

	if (!el)
		return {
			err: `querySelector failed.  selector ${selector} found no match.`,
			data: null,
		};

	let extracted = "";

	if (type === "link") extracted = el.getAttribute("href") as string;
	if (type === "text") extracted = el.textContent;
	if (type === "node") extracted = el.outerHTML;

	if (!extracted)
		return {
			err: `extractFromDOM failed. selector ${selector} returned no match.`,
			data: null,
		};
	return { err: null, data: extracted };
};

export const extractAllFromDOM = (
	type: "links" | "texts" | "nodes",
	selector: string,
	doc: string,
): { err: string; data: null } | { err: null; data: string[] } => {
	const dom = new DOMParser().parseFromString(doc, "text/html");
	const nodes = dom.querySelectorAll(selector);
	if (nodes.length === 0)
		return {
			err: `querySelectorAll failed. selector ${selector} returned no elements`,
			data: null,
		};

	//extract valid Element from each nodes
	const elems = Array.from(nodes).filter((el) => el !== null);

	let r: string[] = [];

	if (type === "links") {
		r = elems
			.map((el) => (el as Element).getAttribute("href"))
			.filter((el) => el !== null);
	}
	if (type === "texts") {
		r = elems
			.map((el) => (el as Element).textContent)
			.filter((el) => el !== null);
	}
	if (type === "nodes") {
		r = elems
			.map((el) => (el as Element).outerHTML)
			.filter((el) => el !== null);
	}

	if (r.length === 0) {
		return {
			err: `extractAllFromDOM failed. selector ${selector} returned no match.`,
			data: null,
		};
	}
	return { err: null, data: r };
};
