import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import * as doc from "../utils/dom.helper.ts";
import createResponse from "../utils/response.helper.ts";

const indexlinks = async (
    c: Context<BlankEnv, "/scr88/indexlinks", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const { input } = await c.req.json();
        const dom = await doc.retrieve(c, supabase, "dom");
        const links = doc.extractAllFromDOM("links", dom, input) as string[];
        const articleDOM = await doc.getDOM(links[0]);
        doc.save(c, supabase, { key: "article_dom", val: articleDOM });
        return createResponse(JSON.stringify(links), 200);
    } catch (e) {
        return createResponse(
            `Internal Server Error: indexlinks failed.  ${e}`,
            500,
        );
    }
};
export default indexlinks;
