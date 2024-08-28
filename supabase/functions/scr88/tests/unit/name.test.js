import { describe, it, expect } from "vitest";
import { getInputTypes, runFn } from "../utils/helper.tests.ts";

describe("/name", () => {
	//Unexpected input types throw error

	it("incorrect endpoint throws error", async () => {
		const res = await runFn("namae", "input", "string");
		expect(res.data).toBe(null);
		expect(res.error).toBeInstanceOf(Error);
	});

	// await Promise.all(
	// 	Object.entries(getInputTypes(["string", "bigint"])).map(([type, value]) => {
	// 		it(`input value = ${type} throws error`, async () => {
	// 			const res = await runFn("name", "input", value);
	// 			expect(res.error).toBe(null);
	// 		});
	// 	}),
	// );

	it("missing input returns error", async () => {
		const res = await runFn("name");
		console.log(res);
		expect(res.data.result).toBe(null);
		expect(res.data.err).toBe("Missing name input");
	});

	it("Incorrect input key name returns error", async () => {
		const res = await runFn("name", "key", "name");
		expect(res.data.result).toBe(null);
		expect(res.data.err).toBe("Missing name input");
	});

	it("unregistered name input returns back input name", async () => {
		const res = await runFn("name", "input", "unusedName");
		expect(res.data.result).toBe("unusedName");
		expect(res.data.err).toBe(null);
	});
	// -> run this when the data is ready
	// it("registered name input returns 'already in use' message" , async () => {
	// 	const res = await runFn("name", "input", "name");
	// 	expect(res.result).toBe(null);
	// 	expect(res.error).not.toBeTruthy();
	// });
});
