const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "../src/icons");
const INDEX_FILE = path.join(ICONS_DIR, "index.ts");

/** Map of deprecated icon name → current icon name */
const DEPRECATED_ALIASES = {
    AlignHorizontalCentre01: "AlignHorizontalCenter01",
    AlignHorizontalCentre02: "AlignHorizontalCenter02",
};

/**
 * Build a self-contained copy of the current icon under its deprecated name.
 *
 * The alias does not re-export from the current icon on purpose: `tsup` runs
 * unbundled, so a sibling import would be emitted extensionless and fail to
 * resolve for consumers doing a deep import (`@untitledui/icons/<Name>`).
 */
function generateAlias(deprecatedName, currentName) {
    const sourceFile = path.join(ICONS_DIR, `${currentName}.tsx`);
    const source = fs.readFileSync(sourceFile, "utf-8");

    const deprecationNotice = `/**
 * @deprecated Renamed to \`${currentName}\` to match the US spelling used across the library.
 * This alias still renders the same icon and will be removed in a future major release.
 */
`;

    return source
        .replace(`export const ${currentName}:`, `${deprecationNotice}export const ${deprecatedName}:`)
        .replaceAll(`${currentName}.displayName = "${currentName}"`, `${deprecatedName}.displayName = "${deprecatedName}"`);
}

function addToIndex(name) {
    const index = fs.readFileSync(INDEX_FILE, "utf-8");

    const exportLine = `export { ${name} } from "./${name}"`;
    if (index.includes(exportLine)) return;

    // Insert in alphabetical order
    const lines = index.split("\n");
    let inserted = false;
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/export \{ (\w+) \}/);
        if (match && match[1].localeCompare(name) > 0) {
            lines.splice(i, 0, exportLine);
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        lines.push(exportLine);
    }

    fs.writeFileSync(INDEX_FILE, lines.join("\n"));
}

console.log("Generating deprecated icon aliases...\n");

for (const [deprecatedName, currentName] of Object.entries(DEPRECATED_ALIASES)) {
    const content = generateAlias(deprecatedName, currentName);

    fs.writeFileSync(path.join(ICONS_DIR, `${deprecatedName}.tsx`), content);
    addToIndex(deprecatedName);
    console.log(`  ${deprecatedName} → ${currentName}`);
}

console.log("\nDone.");
