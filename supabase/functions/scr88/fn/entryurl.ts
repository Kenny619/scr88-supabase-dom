import { setCookie } from "jsr:@hono/hono/cookie";
import * as uuid from "jsr:@std/uuid";
import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import * as val from "../utils/validator.helper.ts";
import * as doc from "../utils/dom.helper.ts";
import createResponse from "../utils/response.helper.ts";

const entryurl = async (
    c: Context<BlankEnv, "/scr88/entryUrl", BlankInput>,
    supabase: SupabaseClient,
) => {
    const url = (await c.req.json()).input;
    if (!val.isUrl(url)) {
        return createResponse(
            false,
            `URL ${url} is not in a valid URL format`,
            400,
        );
    }

    try {
        if (!val.isUrlAlive(url)) {
            return createResponse(
                false,
                `URL ${url} is not reachable`,
                200,
            );
        }
    } catch (e) {
        return createResponse(false, `fetch failed. ${e}`, 400);
    }

    let dom = "";
    try {
        dom = await doc.getDOM(url);
    } catch (e) {
        return createResponse(false, `getDOM failed. ${e}`, 400);
    }

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
    });
    return error
        ? createResponse(false, `Internal Server Error: ${error}`, 500)
        : createResponse(true, url, 200);
};

export default entryurl;
