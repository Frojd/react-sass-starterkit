const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// Output base directory
const outputPath = path.join(__dirname, '/dist');

// static prefix where the static files will be served on the webserver
// Eg: /static/ will be: http://localhost:7000/static/js/index.js
const staticPath = '/static/';

// Root app directory, unless you want a headache, don't change
const context = path.join(__dirname, '/app');


module.exports = [{
    name: 'js',
    devtool: 'source-map',
    context: context,
    publicPath: staticPath,
    entry: {
        app: ['./index.js'],
    },
    output: {
        path: outputPath + '/js',
        filename: 'index.js',
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
        ],
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // })
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
},
{
    name: 'vendor',
    devtool: 'eval',
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
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // })
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
    devtool: 'source-map',
    context: context,
    entry: {
        styles: [
            './scss/index.scss',
            './components/',
        ],
    },
    output: {
        path: outputPath + '/css',
        filename: 'index.css',
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
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
    ],
}];
