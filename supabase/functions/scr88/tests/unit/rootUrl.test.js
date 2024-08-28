import { describe, it, expect } from "vitest";
import { getInputTypes, runFn } from "../utils/helper.tests.ts";

describe("/rooturl", async () => {
	//Unexpected input types throw error

	it("incorrect endpoint throws error", async () => {
		const res = await runFn("rooturll", "input", "string");
		expect(res.data).toBe(null);
		expect(res.error).toBeInstanceOf(Error);
	});

	await Promise.all(
		Object.entries(getInputTypes(["string", "bigint"])).map(([type, value]) => {
			it(`input value = ${type} throws error`, async () => {
				const res = await runFn("rooturl", "input", value);
				expect(res.data.err).toBeTruthy();
			});
		}),
	);

	it("missing input returns error", async () => {
		const res = await runFn("rooturl");
		expect(res.data.result).toBe(null);
		expect(res.data.err).toBe("rootURL input missing");
	});

	it("invalid url returns error", async () => {
		const res = await runFn("rooturl", "input", "sharekowa");
		expect(res.data.result).toBe(null);
		expect(res.data.err).toBe("URL sharekowa is not in a valid URL format");
	});

	it("valid url input returns back passed url", async () => {
		const res = await runFn("rooturl", "input", "https://sharekowa.biz");
		expect(res.data.result).toBe("https://sharekowa.biz");
		expect(res.data.err).toBe(null);
	});
});
