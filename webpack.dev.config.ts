import Config from './webpack.config';
import * as path from 'path';
import NodemonWebpackPlugin from 'nodemon-webpack-plugin';

const outDir: string = path.resolve(__dirname, 'dist', 'debug');

Config.plugins.push(new NodemonWebpackPlugin());

export default Config;