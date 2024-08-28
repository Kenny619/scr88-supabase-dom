import { getCookie } from "jsr:@hono/hono/cookie";
import type { Context } from "jsr:@hono/hono/";
import createResponse from "../utils/response.helper.ts";

export const retrieveDomKey = (c: Context) => {
    const dom_key = getCookie(c, "dom_key");
    if (typeof dom_key !== "string") {
        return createResponse(
            `lasturl failed.  Missing dom_key:${dom_key}`,
            400,
        );
    }
    return dom_key;
};
