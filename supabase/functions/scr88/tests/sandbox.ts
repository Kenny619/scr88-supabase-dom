import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
);

const { data, error } = await supabase.functions.invoke(
    "scr88/getsitecategory",
);

console.log(data, error);
