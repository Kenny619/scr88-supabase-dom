import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import createResponse from "../utils/response.helper.ts";

const getSiteCategory = async (
    supabase: SupabaseClient,
) => {
    const { data, error } = await supabase.from("site_category").select("name");
    return error
        ? createResponse(
            false,
            `Internal Server Error: ${JSON.stringify(error)}`,
            500,
        )
        : new Response(JSON.stringify(data), { status: 200 });
};

export default getSiteCategory;
