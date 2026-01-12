const path = require("path");

const template = (files) => {
    return files
        .map((file) => {
            const name = path.basename(file, path.extname(file));
            return `export { ${name}Icon } from './${name}'`;
        })
        .join("\n");
};
module.exports = template;
