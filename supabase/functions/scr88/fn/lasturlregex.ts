import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import * as doc from "../utils/dom.helper.ts";
import createResponse from "../utils/response.helper.ts";

const lasturlregex = async (
    c: Context<BlankEnv, "/scr88/lasturlregex", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const input = await c.req.text();
        console.log(input);
        const last_url = await doc.retrieve(c, supabase, "last_url");
        console.log(last_url);
        // const escaped = input.replace(/\\/g, "\\$&");
        // console.log(escaped);
        // const regex = new RegExp(escaped);
        const regex = new RegExp(input);
        const lastPageNumber = regex.exec(last_url);

        return (!lastPageNumber || lastPageNumber[1].length === 0)
            ? createResponse(
                false,
                `Provided regexp ${input} found no match`,
                400,
            )
            : createResponse(true, lastPageNumber[1], 200);
    } catch (e) {
        return createResponse(
            false,
            `Internal Server Error: lasturlregex failed.  ${e}`,
            500,
        );
    }
};

export default lasturlregex;
