import * as webpack from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';


const outDir: string = path.resolve(__dirname, 'dist', 'release');

const config: webpack.Configuration = {
    entry: path.resolve(__dirname, 'src/index.js'),
    target: 'node',
    output: {
        filename: 'index.js',
        path: outDir
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
    },
    plugins: [
        new CopyWebpackPlugin([
            { 
                from: path.join(__dirname, 'src', 'server', 'views'), 
                to: path.join(outDir, 'views'),
                toType: 'dir'
            }
        ])
    ]
};

export default config;