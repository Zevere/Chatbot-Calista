import * as webpack from 'webpack';
import * as path from 'path';

const config: webpack.Configuration = {
    entry: path.resolve(__dirname, 'src/index.js'),
    target: 'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'release')
    },
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
};

export default config;