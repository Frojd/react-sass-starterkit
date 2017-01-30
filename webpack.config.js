/* eslint-disable no-undef */
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./internals/config.js')();

// Output base directory
const outputPath = config.outputPath;

// static prefix where the static files will be served on the webserver
// Eg: /static/ will be: http://localhost:7000/static/js/index.js
const staticPath = config.staticPath;

// Root app directory
const context = path.join(__dirname, config.rootFolder);

// Simple plugin for production build
const prod = process.argv && process.argv[3] === '--prod' ? 'production' : '';
let envPlugin = () => {};
if(prod) {
    envPlugin = new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(prod)
        }
    });
}

module.exports = [{
    name: 'js',
    devtool: prod ? '' : 'source-map',
    context: context,
    entry: {
        index: [
            './index.js',
        ],
    },
    output: {
        path: outputPath + '/js',
        filename: '[name].js',
        publicPath: staticPath,
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy'],
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    },
    plugins: [
        envPlugin
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
},
{
    name: 'vendor',
    context: context,
    entry: {
        vendor: './vendor.js',
    },
    output: {
        path: outputPath + '/js',
        filename: 'vendor.js',
    },
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
        },
    ],
    plugins: [
        envPlugin
    ],
},
{
    name: 'copy',
    context: context,
    output: {
        path: outputPath,
        filename: '[name].[ext]'
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'img/**',
                to: outputPath
            }
        ]),
    ],
},
{
    name: 'style',
    devtool: prod ? '' : 'source-map',
    context: context,
    entry: {
        styles: [
            './scss/index.scss',
        ],
    },
    output: {
        path: outputPath + '/css',
        filename: 'index.css',
    },
    module: {
        loaders: [
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'
                ),
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/,
                exclude: /fonts/,
                loader: 'file?name=[path][name].[ext]',
            },
            {
                test: /\.(woff2?|ttf|eot|otf|svg)$/,
                exclude: /img/,
                loader: 'file?name=[path][name].[ext]',
            },
        ],
    },
    postcss: [autoprefixer({ browsers: ['last 3 versions'] })],
    plugins: [
        new ExtractTextPlugin('index.css', {
            allChunks: true,
        }),
        envPlugin
    ],
}];
/* eslint-enable */
