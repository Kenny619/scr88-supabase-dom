/*
const createResponse = (
    pass: boolean,
    msg: string,
    status: number,
): Response => {
    const resBody = pass
        ? JSON.stringify({ pass: pass, result: msg })
        : JSON.stringify({ pass: pass, errMsg: msg });
    return new Response(resBody, { status: status });
};
*/

import { c } from "../../../../../../Library/Caches/deno/npm/registry.npmjs.org/tinyrainbow/1.2.0/dist/index-c1cfc5e9.d.ts";

const createResponse = (
    output: string,
    status: number,
): Response => {
    const c = new Response(output, { status: status });
    c.json = () => {
        return { result: output, err: null };
    };
    return c;
};
export default createResponse;
