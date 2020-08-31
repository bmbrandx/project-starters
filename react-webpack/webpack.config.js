const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

const WriteFilePlugin = require('write-file-webpack-plugin');

const scssLoader = [
    {loader: 'style-loader'},
    {loader: MiniCssExtractPlugin.loader},
    {loader: 'css-loader'},
    {loader: 'sass-loader'}
];

const postcssLoader = [
    {loader: 'style-loader'},
    {loader: 'css-loader', options: {modules: true}},
    {loader: 'postcss-loader', options: {plugins: () => [...postcssPlugins]}}
];

module.exports = (env) => {
    return {
        mode: 'production',
        entry: ['./src/styles/main.sass', './src/js/main.js'],
        watch: true,
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(scss|sass)$/,
                    loader: scssLoader,
                    include: [__dirname]
                },
                {
                    test: /\.css$/,
                    loader: postcssLoader,
                    include: [__dirname]
                }
            ]
        },
        plugins: [
            new WriteFilePlugin(),
            new MiniCssExtractPlugin({
                filename: "styles/main.css",
            }),
            new BrowserSyncPlugin({
                // browse to http://localhost:3000/ during development,
                // ./public directory is being served
                host: 'localhost',
                port: 4700,
                proxy: 'http://localhost:4200/'
            },
                // add the plugin to your plugins array
                {
                    reload: true
                })
        ],
        devServer: {
            historyApiFallback: true,
            contentBase: './',
            port: 4200,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: 'js/main.js'
        },
    }
}