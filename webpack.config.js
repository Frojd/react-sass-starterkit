let autoprefixer = require('autoprefixer');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let webpack = require('webpack');
let path = require('path');

module.exports = [{
    name: 'js',
    devtool: 'source-map',
    entry:  {
        app: [
            __dirname + '/app/index.js'
        ],
        vendor: [
            __dirname + '/app/vendor.js'
        ]
    },
    output: {
        path: __dirname + '/dist/js',
        filename: 'index.js',
        publicPath: 'dist'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy']

                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ],
    externals: {
        // Use external version of React (from CDN for client-side, or
        // bundled with ReactJS.NET for server-side)
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    resolveLoader: {
        fallback: path.resolve(__dirname, './node_modules')
    }
},
{
    name: 'style',
    devtool: 'source-map',
    entry: {
        styles: [
            __dirname + '/app/scss/index.scss',
            __dirname + '/app/components/'
        ]
    }, output: {
        path: __dirname + '/dist/css',
        filename: 'index.css'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'
                )
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/,
                loader: 'file?name=img/[name].[ext]'
            },
            {
                test: /\.(woff2?|ttf|eot|otf)$/,
                loader: 'file?name=fonts/[name].[ext]'
            }
        ]
    },
    postcss: [autoprefixer({ browsers: ['last 3 versions'] })],
    plugins: [
        new ExtractTextPlugin('index.css', {
            allChunks: true
        }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // })

    ]
}]
