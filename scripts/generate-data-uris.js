const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.resolve(__dirname, "../icons");
const OUTPUT_DIR = path.resolve(__dirname, "../src/__data_uri");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.ts");
const SVGO_CONFIG = path.resolve(__dirname, "../svgo.data-uri.config.mjs");

/**
 * Convert kebab-case filename to PascalCase export name
 * e.g., "activity-heart.svg" -> "ActivityHeart"
 */
function toPascalCase(filename) {
    const name = path.basename(filename, ".svg");
    return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

/**
 * Recursively get all SVG files from a directory
 */
function getSvgFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files = files.concat(getSvgFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith(".svg")) {
            files.push(fullPath);
        }
    }
    return files;
}

async function generateDataUris() {
    // Dynamically import ESM modules
    const { loadConfig, optimize } = await import("svgo");

    console.log("Loading SVGO data URI configuration...");
    const svgoConfig = await loadConfig(SVGO_CONFIG);

    console.log(`Searching for SVG files in '${ICONS_DIR}'...`);
    const svgFiles = getSvgFiles(ICONS_DIR);

    if (svgFiles.length === 0) {
        console.log("No SVG files found.");
        return;
    }

    console.log(`Found ${svgFiles.length} SVG files.`);

    // Generate exports
    const exports = [];

    for (const filePath of svgFiles) {
        const filename = path.basename(filePath);
        const exportName = toPascalCase(filename);

        // Read and optimize SVG - SVGO outputs data URI directly with datauri: 'base64'
        const svgContent = fs.readFileSync(filePath, "utf8");
        const result = optimize(svgContent, {
            ...svgoConfig,
            path: filePath,
        });

        // result.data is already a base64 data URI
        exports.push({ name: exportName, dataUri: result.data });
    }

    // Sort exports alphabetically for consistency
    exports.sort((a, b) => a.name.localeCompare(b.name));

    // Generate TypeScript content
    const tsContent = exports
        .map(({ name, dataUri }) => `export const ${name} = "${dataUri}";`)
        .join("\n");

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write output file
    fs.writeFileSync(OUTPUT_FILE, tsContent + "\n", "utf8");

    console.log(`Generated ${OUTPUT_FILE} with ${exports.length} exports.`);
}

generateDataUris().catch((error) => {
    console.error("Error generating data URIs:", error);
    process.exit(1);
});
