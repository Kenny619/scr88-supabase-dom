import "https://esm.sh/v135/@supabase/functions-js@2.4.2/src/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Hono } from "jsr:@hono/hono";

//fn
import name from "./fn/name.ts";
import getSiteCategory from "./fn/getSiteCategory.ts";
import rooturl from "./fn/rooturl.ts";
import entryurl from "./fn/entryurl.ts";
import lasturl from "./fn/lasturl.ts";
import lasturlregex from "./fn/lasturlregex.ts";
import indexlinks from "./fn/indexlinks.ts";
//initialize Hono
const functionName = "scr88";
const app = new Hono().basePath(`/${functionName}`);

//initialize supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

//Routing
app.post("/getsitecategory", async (c) => await getSiteCategory(c, supabase));
app.post("/name", async (c) => await name(c, supabase));
app.post("/rooturl", async (c) => await rooturl(c));
app.post("/entryurl", async (c) => await entryurl(c, supabase));
app.post("/lasturl", async (c) => await lasturl(c, supabase));
app.post("/lasturlregex", async (c) => await lasturlregex(c, supabase));
app.post("/indexlinks", async (c) => await indexlinks(c, supabase));

Deno.serve(app.fetch);
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scr88/getSiteCategory' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
