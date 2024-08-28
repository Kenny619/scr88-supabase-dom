import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import * as doc from "../utils/dom.helper.ts";

const lasturl = async (
    c: Context<BlankEnv, "/scr88/lasturl", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const { input } = await c.req.json();
        const dom = await doc.retrieve(c, supabase, "dom");
        const last_url = doc.extractFromDOM("link", dom as string, input);
        await doc.save(c, supabase, {
            key: "last_url",
            val: last_url,
        });
        return c.json({ result: last_url, err: null });
    } catch (e) {
        return c.json({
            result: null,
            err: `Internal Server Error: lasturl failed.  ${e}`,
        });
    }
};

export default lasturl;
