const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
        buildDependencies: {
            yarnlock: [ path.resolve(__dirname, 'yarn.lock') ]
        },
        cacheDirectory: path.resolve(__dirname, '.cache')
    },
    devtool: 'source-map',
    entry: {
        theme: './client/scss/theme.scss',
        app: './client/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/client'),
        filename: '[name].[contenthash].js'
    },
    resolve: {
        extensions: [ '.ts', '.js', '.vue', '.json' ]
    },
    module: {
        rules: [
            {
                test: /\.[t|j]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: 'client/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './client/static', to: './static' },
                { from: './client/manifest.webmanifest', to: './manifest.webmanifest' }
            ]
        }),
        new StatsWriterPlugin({
            filename: 'stats.json'
        }),
        new CleanWebpackPlugin(),
        new RemoveEmptyScriptsPlugin()
    ]
};
