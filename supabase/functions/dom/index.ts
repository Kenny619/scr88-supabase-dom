// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";

import url from "./routes/url.ts";
import regex from "./routes/regex.ts";
import extract from "./routes/extract.ts";
import lastPageNumber from "./routes/lastPageNumber.ts";
const functionName = "dom";
const app = new Hono().basePath(`/${functionName}`);

/* return format
{
    "err": null | string,
    "data": null | Record<string, unknown>
}
*/

//Routing
app.post("/url", async (c) => await url(c));
app.post("/regex", async (c) => await regex(c));
app.post("/extract", async (c) => await extract(c));
app.post("/lastPageNumber", async (c) => await lastPageNumber(c));
Deno.serve(app.fetch);
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dom' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
