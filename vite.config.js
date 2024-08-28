import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		poolOptions: {
			threads: { execArgv: ["--env-file=.env"] },

			// Or another pool:
			forks: { execArgv: ["--env-file=.env"] },
		},
	},
	files: ["./tests/*.test.ts"], // Adjust the pattern to match your test files
	extensions: ["ts"],
});
