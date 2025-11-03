module.exports = {
    outDir: "./src/icons",
    indexTemplate: require("./templates/index"),
    template: require("./templates/component"),
    icon: true,
    ref: false,
    jsxRuntime: "classic",
    typescript: true,
    dimensions: true,
    expandProps: "end",
    prettier: true,
    svgo: true,
    svgProps: {
        width: "{size}",
        height: "{size}",
        stroke: "{color}",
        strokeWidth: "2",
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
    },
    jsx: {
        babelConfig: {
            plugins: [
                [
                    "@svgr/babel-plugin-remove-jsx-attribute",
                    {
                        elements: ["svg", "path", "circle", "rect", "ellipse", "Svg", "Path", "Circle", "Rect", "Ellipse"],
                        attributes: [
                            "xmlns",
                            "width",
                            "height",
                            "fill",
                            "data-name",
                            "id",
                            "style",
                            "stroke",
                            "strokeWidth",
                            "strokeLinejoin",
                            "strokeLinecap",
                        ],
                    },
                ],
            ],
        },
    },
};
