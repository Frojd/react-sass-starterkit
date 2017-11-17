/**
 * Custom webpack devserver
 */

/* eslint-disable no-undef, no-unused-vars */
const fs = require('fs');
const path = require('path')
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
        cached: false,
        moduleTrace: false
    },
    disableHostCheck: true,
    proxy: internalServer.proxy(process.argv),
    publicPath: config.publicPath,
});

function paths(app) {
    // Dev js
    app.get('/devserver.js', (req, res) => {
        const rootFolder = process.cwd();
        const rootTemplatePath = config.rootServerTemplatePath;
        const devJs = fs.readFileSync(`${path.posix.join(rootFolder, rootTemplatePath)}/devserver.js`)
        res.setHeader('Content-Type', 'text/javascript');
        res.end(devJs)
    });

    // Dev css
    app.get('/devserver.css', (req, res) => {
        const rootFolder = process.cwd();
        const rootTemplatePath = config.rootServerTemplatePath;
        const devCss = fs.readFileSync(`${path.posix.join(rootFolder, rootTemplatePath)}/devserver.css`)
        res.setHeader('Content-Type', 'text/css');
        res.end(devCss)
    });

    // Root
    app.get(config.publicPathPrefix, (req, res) => {
        res.end(internalServer.renderListing())
    });

    // Components
    app.get(internalServer.components.map((component) => `${config.publicPathPrefix}${component}`), (req, res) => {
        res.end(
            internalServer.renderComponent(
                req.path.replace(config.publicPathPrefix, ''),
                config.useServerRendering, 
                req
            )
        )
    });
}

console.log(`Server started on port ${config.port}`)
server.listen(config.port);
/* eslint-enable no-undef, no-unused-vars */
