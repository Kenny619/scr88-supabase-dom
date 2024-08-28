import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import { err, result } from "../utils/context.helper.ts";
const getSiteCategory = async (
    c: Context<BlankEnv, "/scr88/getsitecategory", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const { data, error } = await supabase.from("site_category").select(
            "name",
        );
        return error
            ? c.json(
                err(`Failed to get site category from DB. ${
                    JSON.stringify(error)
                }`),
            )
            : result(data).c.json(this);
    } catch (e) {
        return c.json(
            err(`Internal Server Error:  Failed to check DB. ${
                JSON.stringify(e)
            }`),
        );
    }
};

export default getSiteCategory;
