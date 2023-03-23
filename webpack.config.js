// @ts-check

const path = require("path");
const webpack = require("webpack");

/** @type {webpack.Configuration}  */
const config = {
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, "dist")
        },
        host: "localhost",
        compress: true,
        client: {
            overlay: true,
            logging: "info",
            progress: true
        },
        hot: true
    },
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            "fs": false,
            "path": false
        },
        alias: {
            "brotli": path.resolve(__dirname, "dist/assets/brotli")
        }
    },
    module: {
        rules: [
            {
                test: /.ts/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    },
    "experiments": {
        "asyncWebAssembly": true
    }
};

module.exports = config;
