import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import { resError, resResult } from "../utils/helper.response.ts";
export const getSiteCategory = async (
    c: Context<BlankEnv, "/register/getsitecategory", BlankInput>,
    supabase: SupabaseClient,
) => {
    const { data, error } = await supabase.from("site_category").select(
        "name",
    );
    return error
        ? c.json(
            resError(
                `Failed to get site category from DB. ${JSON.stringify(error)}`,
            ),
        )
        : c.json(resResult(data));
};

export default getSiteCategory;
