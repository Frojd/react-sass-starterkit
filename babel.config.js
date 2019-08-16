/* global module process */
const presets = [
    [
        '@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: process.env['CORE_JS'] ? process.env['CORE_JS'] : 3,
        }
    ],
    '@babel/preset-react'
];
const plugins = [
    ['react-docgen', {}, 'docgen'],
    ['babel-plugin-webpack-alias', {}, 'webpackaliases'],
    ['@babel/plugin-proposal-class-properties', {}, 'classprops'],
    ['@babel/plugin-proposal-export-default-from', {}, 'exportdefaultfrom'],
];

if(process.env['NODE_ENV'] !== 'production') {
    plugins.push('react-hot-loader/babel');
}

module.exports = {
    presets,
    plugins
};
