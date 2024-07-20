import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import createResponse from "../utils/response.helper.ts";

const name = async (
    c: Context<BlankEnv, "/scr88/name", BlankInput>,
    supabase: SupabaseClient,
): Promise<Response> => {
    let input: string;
    try {
        const req = await c.req.json();
        input = req.input;
    } catch (error) {
        return createResponse(
            false,
            `Internal Server Error: ${JSON.stringify(error)}`,
            500,
        );
    }
    const { data, error } = await supabase.from("scrapers").select("name");
    if (error) {
        return createResponse(
            false,
            `Internal Server Error: ${JSON.stringify(error)}`,
            500,
        );
    }
    const exists = data.find((item) => item.name === input);
    const res = exists
        ? JSON.stringify({
            pass: false,
            errMsg: `Name '${input}' is not valid`,
        })
        : JSON.stringify({ pass: true, result: input });
    return createResponse(true, res, 200);
};

export default name;
