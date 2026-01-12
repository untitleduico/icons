import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/icons"],
    splitting: true,
    sourcemap: false,
    clean: true,
    bundle: false,
    format: ["esm", "cjs"],
    dts: true,
    legacyOutput: false,
    onSuccess: async () => {
        const fs = await import("fs");
        const path = await import("path");

        const indexMjsPath = path.join("dist", "index.mjs");

        if (fs.existsSync(indexMjsPath)) {
            let content = fs.readFileSync(indexMjsPath, "utf-8");
            content = content.replace(/from"\.\/([^"]+)"/g, 'from"./$1.mjs"');
            fs.writeFileSync(indexMjsPath, content);
        }
    },
});
