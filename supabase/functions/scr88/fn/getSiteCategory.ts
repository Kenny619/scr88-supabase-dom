import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
const getSiteCategory = async (
    c: Context<BlankEnv, "/scr88/getsitecategory", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const { data, error } = await supabase.from("site_category").select(
            "name",
        );
        return error
            ? c.json({
                result: null,
                err: `Failed to get site category from DB. ${
                    JSON.stringify(error)
                }`,
            })
            : c.json({
                result: data,
                err: null,
            });
    } catch (e) {
        return c.json({
            result: null,
            err: `Internal Server Error:  Failed to check DB. ${
                JSON.stringify(e)
            }`,
        });
    }
};

export default getSiteCategory;
