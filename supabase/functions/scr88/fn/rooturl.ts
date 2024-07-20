import type { Context } from "jsr:@hono/hono/";
import type { BlankEnv, BlankInput } from "jsr:@hono/hono/types";
import * as val from "../utils/validator.helper.ts";
import createResponse from "../utils/response.helper.ts";
const rooturl = async (c: Context<BlankEnv, "/scr88/rootUrl", BlankInput>) => {
    let url: string;
    try {
        const req = await c.req.json();
        url = req.input;
        if (!val.isUrl(url)) {
            return createResponse(
                false,
                `URL ${url} is not in a valid URL format`,
                400,
            );
        }

        return await val.isUrlAlive(url)
            ? createResponse(
                true,
                JSON.stringify({ pass: true, result: url }),
                200,
            )
            : createResponse(false, `URL ${url} is not reachable`, 200);
    } catch (e) {
        return createResponse(false, `fetch failed. ${e}`, 400);
    }
};

export default rooturl;
