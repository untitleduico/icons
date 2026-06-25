const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.resolve(__dirname, "../icons");

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

module.exports = { ICONS_DIR, toPascalCase, getSvgFiles };
