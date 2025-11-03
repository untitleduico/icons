const generalConfig = require("./.svgrrc.js");

const svgProps = { ...generalConfig.svgProps };
delete svgProps["aria-hidden"];

module.exports = {
    ...generalConfig,
    template: require("./templates/component.native"),
    outDir: './src/icons/native',
    native: true,
    svgProps: svgProps,
};
