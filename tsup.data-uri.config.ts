import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/__data_uri/index.ts"],
    outDir: "dist/__data_uri",
    splitting: true,
    sourcemap: false,
    clean: false,
    bundle: false,
    format: ["esm", "cjs"],
    dts: true,
    legacyOutput: false,
});

