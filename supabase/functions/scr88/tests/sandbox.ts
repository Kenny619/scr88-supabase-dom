import { fetchFn, runFn } from "./helper.tests.ts";

try {
    const res = await fetchFn("getsitecategory", "input", "test");
    console.log(await res?.json());
} catch (e) {
    console.log("e:", e as Error);
}
