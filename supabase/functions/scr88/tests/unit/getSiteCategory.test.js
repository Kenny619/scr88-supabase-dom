import { describe, it, expect } from "vitest";
import { getInputTypes, runFn } from "../utils/helper.tests.ts";

describe("/name", async () => {
	//Unexpected input types throw error

	it("incorrect endpoint throws error", async () => {
		const res = await runFn("sitecategory", "input", "string");
		expect(res.data).toBe(null);
		expect(res.error).toBeInstanceOf(Error);
	});

	await Promise.all(
		Object.entries(getInputTypes(["string", "bigint"])).map(([type, value]) => {
			it(`input value = ${type} throws error`, async () => {
				const res = await runFn("getsitecategory", "input", value);
				console.log(res);
				expect(res.data.result).toBeTruthy();
				expect(res.data.error).toBe(null);
			});
		}),
	);

	it("No input values returns site categories", async () => {
		const res = await runFn("getsitecategory");
		expect(res.data.result).toBeTruthy();
		expect(res.data.err).toBe("null");
	});

	it("Incorrect input key name returns site categories", async () => {
		const res = await runFn("getsitecategory", "key", "name");
		expect(res.data.result).toBeTruthy();
		expect(res.data.err).toBe("null");
	});
});
