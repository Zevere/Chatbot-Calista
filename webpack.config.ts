import * as webpack from 'webpack';
import * as path from 'path';

const config: webpack.Configuration = {
    entry: path.resolve(__dirname, 'lib/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, use: [
                    {
                        loader: 'babel-loader', options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                [require("@babel/plugin-proposal-pipeline-operator"), { proposal: 'minimal'}],
                                require("@babel/plugin-proposal-nullish-coalescing-operator"),
                                require("@babel/plugin-transform-flow-strip-types"),
                                require("@babel/plugin-proposal-optional-chaining"),
                                require("flow-runtime")
                            ]
                        }
                    }
                ]
            }
        ]
    }
};

export default config;