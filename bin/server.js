/**
 * Custom webpack devserver
 */

/* eslint-disable no-undef, no-unused-vars */

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const internalServer = require('../internals/server');
const config = require('../internals/config.js')();

const server = new webpackDevServer(webpack(internalServer.webpackConf(process.argv)), {
    before: paths,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: {
        colors: true,
        chunks: false,
        version: false,
        hash: false,
    },
    disableHostCheck: true,
    proxy: internalServer.proxy(process.argv),
    publicPath: config.publicPath,
});

function paths(app) {
    // Root
    app.get(config.publicPathPrefix, (req, res) => {
        res.end(internalServer.renderListing())
    });

    // Components
    app.get(internalServer.components.map((component) => `${config.publicPathPrefix}${component}`), (req, res) => {
        res.end(internalServer.renderComponent(req.path.replace(config.publicPathPrefix, '')))
    });
}

console.log(`Server started on port ${config.port}`)
server.listen(config.port);
/* eslint-enable no-undef, no-unused-vars */
