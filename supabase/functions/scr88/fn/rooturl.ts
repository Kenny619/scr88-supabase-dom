import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import * as val from "../utils/validator.helper.ts";
const rooturl = async (c: Context<BlankEnv, "/scr88/rooturl", BlankInput>) => {
    try {
        const input = (await c.req.json()).input || null;
        if (!input) {
            return c.json({ result: null, err: "rootURL input missing" });
        }
        if (!val.isUrl(input)) {
            return c.json({
                result: null,
                err: `URL ${input} is not in a valid URL format`,
            });
        }

        return await val.isUrlAlive(input)
            ? c.json({ result: input, err: null })
            : c.json({ result: null, err: `URL ${input} is not reachable` });
    } catch (e) {
        return c.json({ result: null, err: `fetch failed. ${e}` });
    }
};

export default rooturl;
