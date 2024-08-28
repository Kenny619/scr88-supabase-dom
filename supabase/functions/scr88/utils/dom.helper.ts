import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";
import { getCookie } from "jsr:@hono/hono/cookie";
import type { Context } from "jsr:@hono/hono/";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { retrieveDomKey } from "./noho.helper.ts";

export async function getDOM(url: string) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.getElementsByTagName("body")[0].outerHTML;
    } catch (_) {
        return null;
    }
}

export async function retrieve(
    c: Context,
    supabase: SupabaseClient,
    column: string,
): Promise<string> {
    const dom_key = getCookie(c, "dom_key");
    if (!dom_key) throw new Error("Failed to retrieve dom_key");
    const { data, error } = await supabase.from("tmp_dom").select(`"${column}"`)
        .eq(
            "dom_key",
            dom_key,
        );
    if (error) throw new Error(JSON.stringify(error));
    return data[0][column as keyof typeof data[0]];
}

export function extractFromDOM(
    type: "link" | "text" | "node",
    dom: string,
    selector: string,
): string {
    const doc = new DOMParser().parseFromString(dom, "text/html");
    const el = doc.querySelector(selector);
    if (!el) throw new Error("querySelector failed in extractFromDOM");

    let extracted = null;

    if (type === "link") extracted = el.getAttribute("href");
    if (type === "text") extracted = el.textContent;
    if (type === "node") extracted = el.outerHTML;

    if (!extracted) {
        throw new Error(
            `extractFromDOM failed. selector ${selector} found no match.`,
        );
    }
    return extracted;
}

export function extractAllFromDOM(
    type: "links" | "texts" | "nodes",
    dom: string,
    selector: string,
): string[] | { error: string } {
    const doc = new DOMParser().parseFromString(dom, "text/html");
    const nodes = doc.querySelectorAll(selector);
    if (nodes.length === 0) {
        throw new Error(
            `extractFromDOM failed. ${selector} returned no elements`,
        );
    }

    //extract valid Element from each nodes
    const elems = Array.from(nodes).map((node) => node as Element)
        .filter((el) => el !== null);

    let queryResult: string[] = [];

    switch (type) {
        case "links":
            queryResult = elems.map((el) => el.getAttribute("href")).filter((
                el,
            ) => el !== null);
            break;
        case "texts":
            queryResult = elems.map((el) => el.textContent).filter((el) =>
                el !== null
            );
            break;
        case "nodes":
            queryResult = elems.map((el) => el.outerHTML).filter((el) =>
                el !== null
            );
            break;
    }

    if (queryResult.length === 0) {
        throw new Error("Input selector could not find a match");
    }

    return queryResult;
}

export async function save(
    c: Context,
    supabase: SupabaseClient,
    insertObj: { key: string; val: string },
): Promise<void> {
    try {
        const dom_key = retrieveDomKey(c);
        const { error } = await supabase.from("tmp_dom").update({
            [insertObj.key]: insertObj.val,
        }).eq(
            "dom_key",
            dom_key,
        );
        if (error) throw new Error(JSON.stringify(error));
    } catch (e) {
        throw new Error(e);
    }
}
