const fs = require("fs");
const path = require("path");
const { ICONS_DIR, toPascalCase, getSvgFiles } = require("./_shared");

const OUTPUT_DIR = path.resolve(__dirname, "../src/__inventory");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.ts");

function generateInventory() {
    console.log(`Searching for SVG files in '${ICONS_DIR}'...`);
    const svgFiles = getSvgFiles(ICONS_DIR);

    if (svgFiles.length === 0) {
        console.log("No SVG files found.");
        return;
    }

    const names = svgFiles.map((file) => toPascalCase(path.basename(file)));
    names.sort((a, b) => a.localeCompare(b));

    const tsContent =
        "export const iconNames = [\n" +
        names.map((name) => `    "${name}"`).join(",\n") +
        ",\n] as const;\n\n" +
        "export type IconName = (typeof iconNames)[number];\n";

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, tsContent, "utf8");

    console.log(`Generated ${OUTPUT_FILE} with ${names.length} names.`);
}

generateInventory();
