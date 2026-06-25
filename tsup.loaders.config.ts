import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/__loaders/index.ts"],
    outDir: "dist/__loaders",
    splitting: true,
    sourcemap: false,
    clean: false,
    bundle: false,
    format: ["esm", "cjs"],
    dts: true,
    legacyOutput: false,
});
