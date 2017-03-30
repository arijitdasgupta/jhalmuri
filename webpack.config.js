module.exports = {
    entry: "./src/frontend/bundle.ts",
    output: {
        filename: "bundle.js",
        path: __dirname + "/build/assets",
        publicPath: "/blog/assets/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    // Dev Server
    devServer: {
        inline: true,
        proxy: {
            '*': {
                target: 'http://localhost:7777',
                secure: false
            }
        }
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.scss$/, use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                }]
            }
        ]
    }
};
