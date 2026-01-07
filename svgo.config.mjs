import path from "path";

export default {
    multipass: true,
    plugins: [
        {
            name: "preset-default",
        },
        {
            name: "cleanupIds",
            params: {
                minify: true,
                remove: true,
            },
        },
        {
            name: "prefixIds",
            params: {
                prefix: (_astNode, info) => path.basename(info.path, ".svg"),
                delim: "_svg__",
                prefixClassNames: true,
                prefixIds: true,
            },
        },
    ],
};
