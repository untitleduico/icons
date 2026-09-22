const fs = require("fs");
const path = require("path");

const pkg = require("../package.json");
const DIST = path.join(__dirname, "../dist");

/** Names kept as deprecated aliases so existing imports do not break */
const DEPRECATED_ALIASES = {
    AlignHorizontalCentre01: "AlignHorizontalCenter01",
    AlignHorizontalCentre02: "AlignHorizontalCenter02",
};

const failures = [];
const fail = (message) => failures.push(message);

async function versionIsUnpublished() {
    const response = await fetch(`https://registry.npmjs.org/${pkg.name}`);

    if (response.status === 404) return;

    if (!response.ok) {
        console.log(`  ? could not reach the registry (${response.status}), skipping the duplicate-version check`);
        return;
    }

    const { versions } = await response.json();

    if (versions[pkg.version]) {
        fail(`${pkg.name}@${pkg.version} is already published — bump the version before publishing`);
    }
}

function distExists() {
    if (!fs.existsSync(path.join(DIST, "index.js"))) {
        fail("dist/ is missing or incomplete — run `npm run build` first");
    }
}

/**
 * Unbundled ESM output leaves the barrel's re-exports extensionless, which
 * strict ESM resolvers reject. A `tsup` post-build step rewrites them, and this
 * guards against that step being dropped: the failure is silent at build time
 * and only surfaces as ERR_MODULE_NOT_FOUND in a consumer's app.
 */
function esmSpecifiersCarryExtensions() {
    const barrel = path.join(DIST, "index.mjs");
    if (!fs.existsSync(barrel)) return;

    const extensionless = [...fs.readFileSync(barrel, "utf-8").matchAll(/from"(\.\/[^"]+)"/g)]
        .map((match) => match[1])
        .filter((specifier) => !specifier.endsWith(".mjs"));

    if (extensionless.length) {
        fail(`${extensionless.length} ESM re-exports have no file extension (e.g. ${extensionless[0]}) — they will not resolve`);
    }
}

async function exportsResolve() {
    let cjs, esm;

    try {
        cjs = require(path.join(DIST, "index.js"));
    } catch (error) {
        return fail(`the CJS barrel does not load: ${error.message}`);
    }

    try {
        esm = await import(`file://${path.join(DIST, "index.mjs")}`);
    } catch (error) {
        return fail(`the ESM barrel does not load: ${error.message}`);
    }

    for (const [deprecated, current] of Object.entries(DEPRECATED_ALIASES)) {
        let exported = true;

        for (const [format, mod] of [["CJS", cjs], ["ESM", esm]]) {
            if (typeof mod[current] !== "function") {
                fail(`${current} is not exported from the ${format} barrel`);
                exported = false;
            }
            if (typeof mod[deprecated] !== "function") {
                fail(`deprecated alias ${deprecated} is not exported from the ${format} barrel`);
                exported = false;
            }
        }

        // The alias has to keep rendering the icon it was renamed from
        if (exported) {
            const render = (Component) => JSON.stringify(Component({}), (key, value) => (key === "_owner" || key === "_store" ? undefined : value));
            if (render(cjs[deprecated]) !== render(cjs[current])) {
                fail(`${deprecated} no longer renders the same icon as ${current}`);
            }
        }
    }

    console.log(`  exports: ${Object.keys(cjs).length} (CJS) / ${Object.keys(esm).length} (ESM)`);
}

async function main() {
    console.log(`Verifying ${pkg.name}@${pkg.version}\n`);

    distExists();
    if (!failures.length) {
        esmSpecifiersCarryExtensions();
        await exportsResolve();
        await versionIsUnpublished();
    }

    if (failures.length) {
        console.error("\nBuild is not publishable:");
        for (const message of failures) console.error(`  - ${message}`);
        process.exit(1);
    }

    console.log("\nBuild verified.");
}

main().catch((error) => {
    console.error(`\nVerification could not complete: ${error.stack}`);
    process.exit(1);
});
