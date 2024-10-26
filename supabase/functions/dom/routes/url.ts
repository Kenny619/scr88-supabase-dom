import type { Context } from "jsr:@hono/hono/";
import val from "../utils/validators.ts";

const rootUrl = async (c: Context) => {
	const { err, data } = await val(c, "url");
	return c.json({ err, data });
};

export default rootUrl;
