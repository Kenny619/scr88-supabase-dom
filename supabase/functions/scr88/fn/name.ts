import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
const name = async (
    c: Context<BlankEnv, "/scr88/name", BlankInput>,
    supabase: SupabaseClient,
) => {
    try {
        const requestedName = (await c.req.json()).input || null;
        if (requestedName === null) {
            return c.json({
                result: null,
                err: "Missing name input",
            });
        }

        const { data, error } = await supabase.from("scrapers").select("name");
        if (error) {
            return c.json({
                result: null,
                err: `Internal Server Error:  Failed to check DB. ${
                    JSON.stringify(error)
                }`,
            });
        }

        const requesteedNameUsed = data.find((item) =>
            item.name === requestedName
        );
        if (requesteedNameUsed) {
            return c.json({
                result: null,
                err: `Name '${requestedName}' is already being used.  Choose another name.`,
            });
        }

        return c.json({
            result: requestedName,
            err: null,
        });
    } catch (error) {
        return c.json({
            result: null,
            err: `Internal Server Error:  Failed to check DB. ${
                JSON.stringify(error)
            }`,
        });
    }
};

export default name;
