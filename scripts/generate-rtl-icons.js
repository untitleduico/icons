const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "../src/icons");
const INDEX_FILE = path.join(ICONS_DIR, "index.ts");

/** Map of direction-aware icon name → source physical icon name */
const RTL_ICONS = {
    ArrowNext: "ArrowRight",
    ArrowPrevious: "ArrowLeft",
    ChevronNext: "ChevronRight",
    ChevronPrevious: "ChevronLeft",
    ChevronNextDouble: "ChevronRightDouble",
    ChevronPreviousDouble: "ChevronLeftDouble",
};

const DESCRIPTIONS = {
    ArrowNext: "forward",
    ArrowPrevious: "backward",
    ChevronNext: "forward",
    ChevronPrevious: "backward",
    ChevronNextDouble: "forward",
    ChevronPreviousDouble: "backward",
};

function generateRtlIcon(name, sourceName) {
    const sourceFile = path.join(ICONS_DIR, `${sourceName}.tsx`);
    const sourceContent = fs.readFileSync(sourceFile, "utf-8");

    // Extract the SVG path(s) from the source icon
    const pathMatches = sourceContent.match(/<path[^/]*\/>/g);
    if (!pathMatches) {
        console.error(`Could not extract paths from ${sourceName}.tsx`);
        return null;
    }

    const paths = pathMatches.join("\n        ");
    const direction = DESCRIPTIONS[name];

    return `import * as React from "react";
import type { SVGProps, FC } from "react";
interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}
/**
 * Direction-aware icon pointing "${direction}". Renders as ${sourceName} in LTR and mirrors in RTL.
 *
 * Uses the \`data-rtl-flip\` attribute to flip via CSS. Add this rule to your global styles:
 * \`\`\`css
 * [data-rtl-flip]:dir(rtl) { transform: scaleX(-1); }
 * \`\`\`
 */
export const ${name}: FC<Props> = ({ size = 24, color = "currentColor", ...props }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        data-rtl-flip=""
        {...props}
    >
        ${paths}
    </svg>
);
${name}.displayName = "${name}";
`;
}

function addToIndex(name) {
    let index = fs.readFileSync(INDEX_FILE, "utf-8");

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

console.log("Generating RTL-aware direction icons...\n");

for (const [name, sourceName] of Object.entries(RTL_ICONS)) {
    const content = generateRtlIcon(name, sourceName);
    if (!content) continue;

    const outPath = path.join(ICONS_DIR, `${name}.tsx`);
    fs.writeFileSync(outPath, content);
    addToIndex(name);
    console.log(`  ${name} (from ${sourceName})`);
}

console.log("\nDone.");
