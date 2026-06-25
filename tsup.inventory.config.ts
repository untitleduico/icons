import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/__inventory/index.ts"],
    outDir: "dist/__inventory",
    splitting: true,
    sourcemap: false,
    clean: false,
    bundle: false,
    format: ["esm", "cjs"],
    dts: true,
    legacyOutput: false,
});
