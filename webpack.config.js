const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        bundle: ['babel-polyfill', './js/init.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            'Promise': 'exports-loader?global.Promise!es6-promise',
            'fetch': 'exports-loader?self.fetch!whatwg-fetch'
        }),
       // new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            hash: true,
            minify: {
                html5: true
            },
            template: '../index.html'
        })
    ],
    module: {
        rules: [

            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    plugins: [
                        'syntax-async-functions',
                        'transform-async-to-generator',
                        'transform-regenerator',
                        'transform-runtime'
                    ],
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?importLoaders=1&sourceMap',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: false,
        port: 9000,
        historyApiFallback: true,
        hot: false,
        host: '127.0.0.1'
    }
};