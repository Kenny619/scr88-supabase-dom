import { getCookie, setCookie } from "jsr:@hono/hono/cookie";
import * as uuid from "jsr:@std/uuid";
import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import * as val from "../utils/validator.helper.ts";
import * as doc from "../utils/dom.helper.ts";
import { err, result } from "../utils/context.helper.ts";

const entryurl = async (
    c: Context<BlankEnv, "/scr88/entryurl", BlankInput>,
    supabase: SupabaseClient,
) => {
    const entry_url = (await c.req.json()).input || null;
    if (!entry_url) return err("entryURL input missing");
    if (!val.isUrl(entry_url)) {
        return err(`URL ${entry_url} is not in a valid URL format`);
    }
    if (!val.isUrlAlive(entry_url)) {
        return err(`URL ${entry_url} is not reachable`);
    }

    const dom = await doc.getDOM(entry_url);
    if (!dom) return err("Failed to acquire DOM. getDOM failed");

    //check if cookie is already set
    //if not, delete the entry from tmp_dom table
    const old_dom_key = getCookie(c, "dom_key");
    if (old_dom_key) {
        const { error } = await supabase.from("tmp_dom").delete().eq(
            "dom_key",
            old_dom_key,
        );
        if (error) {
            console.log(error); //display error in console and proceed
            /*
            return c.json({
                result: null,
                err: `Failed to delete old DOM. ${error}`,
            });
            */
        }
    }

    //issue new dom_key and set cookie
    const dom_key = uuid.v1.generate();
    setCookie(c, "dom_key", dom_key, {
        httpOnly: true,
        path: "/",
        secure: false,
    });

    //insert dom and domKey into tmp_dom table
    const { error } = await supabase.from("tmp_dom").insert({
        dom,
        dom_key,
        entry_url,
    });

    return error
        ? err(
            `Failed to insert DOM into DB.  Please try again. ${error}`,
        )
        : result(entry_url);
};

export default entryurl;
