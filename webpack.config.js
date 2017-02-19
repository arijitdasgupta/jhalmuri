module.exports = {
    entry: "./src/frontend/bundle.ts",
    output: {
        filename: "bundle.js",
        path: __dirname + "/build/assets"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    }
};