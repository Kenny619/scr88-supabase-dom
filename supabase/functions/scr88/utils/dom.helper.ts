import { DOMParser } from "jsr:@b-fuze/deno-dom";
export async function getDOM(url: string) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.getElementsByTagName("body")[0].outerHTML;
    } catch (e) {
        throw new Error(e);
    }
}
