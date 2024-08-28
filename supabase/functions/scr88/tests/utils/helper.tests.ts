import process from "node:process";
import { createClient } from "@supabase/supabase-js";

type FnName =
    | "name"
    | "getsitecategory"
    | "entryurl"
    | "lasturl"
    | "indexlinks"
    | "lasturlregex"
    | "rooturl";
export async function runFn(
    fnname: FnName,
    bodyKey?: string,
    bodyValue?: string,
) {
    const supabase = createClient(
        "http://127.0.0.1:54321",
        process.env.SUPABASE_ANON_KEY as string,
    );

    let input: { [key: string]: string } = {};
    if (bodyKey && bodyValue) {
        input[bodyKey] = bodyValue;
    } else {
        input = {};
    }

    try {
        const { data, error } = await supabase.functions.invoke(
            `scr88/${fnname}`,
            {
                body: input,
            },
        );
        return { data, error };
    } catch (error) {
        throw new Error(error);
    }
}

export async function fetchFn(
    fnname: FnName,
    bodyKey?: string,
    bodyValue?: string,
) {
    try {
        const bodyKV: { [key: string]: string } = {};

        if (bodyKey && bodyValue) {
            bodyKV[bodyKey] = bodyValue;
        }

        const request = new Request(
            `http://127.0.0.1:54321/functions/v1/scr88/${fnname}`,
            {
                method: "POST",
                headers: {
                    "Authorization":
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyKV),
            },
        );
        return await fetch(request);
    } catch (error) {
        console.error("fetch failed", error);
    }
}

type InputType =
    | "null"
    | "undefined"
    | "NaN"
    | "string"
    | "emptyString"
    | "number"
    | "zero"
    | "Infinity"
    | "boolean"
    | "array"
    | "emptyArray"
    | "object"
    | "emptyObject"
    | "function"
    | "symbol"
    | "bigint";

export function getInputTypes(expectedType: InputType | InputType[]) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const typeValues: Record<InputType, any> = {
        null: null,
        undefined: undefined,
        NaN: Number.NaN,
        string: "string",
        emptyString: "",
        number: 1,
        zero: 0,
        Infinity: Number.POSITIVE_INFINITY,
        boolean: true,
        array: [1, 2, 3],
        emptyArray: [],
        object: { a: 1, b: 2, c: 3 },
        emptyObject: {},
        function: () => {},
        symbol: Symbol(),
        bigint: 100n,
    };

    if (Array.isArray(expectedType)) {
        for (const type of expectedType) {
            if (typeValues[type]) {
                delete typeValues[type];
            }
        }
    } else {
        delete typeValues[expectedType];
    }

    return typeValues;
}
