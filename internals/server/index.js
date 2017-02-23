/**
 * Internals of the custom webpack devserver setup
 */

/* eslint-disable no-undef, no-unused-vars */

const fs = require('fs');
const path = require('path');

const config = require('../config')();
const getData = require('../utils').getData;

// Global variables for templates
const rootFolder = process.cwd();
const rootTemplatePath = config.rootServerTemplatePath;
const publicPath = config.publicPath;
const containerId = config.containerId;
const port = config.port;
const publicPathPrefix = config.publicPathPrefix;
const componentPath = path.join(config.appFolder, config.componentsFolder);
const context = config.context;
const components = getDirectories(path.join(rootFolder, componentPath));


function renderComponent(componentName, cb) {
    let index = getIndexTemplate(componentName);
    let snippet = getSnippet(componentName);
    let render = getRender(componentName);
    let template = index.replace('<!-- content -->', snippet).replace('<!-- react-render -->', render);

    if(cb) {
        return cb(template);
    }

    return template;
}

function renderListing(cb) {
    let listOfComponents = components.map((componentName) =>
        getListItem(componentName)
    ).join('');

    let template = getIndexTemplate().replace('<!-- content -->', listOfComponents);

    if(cb) {
        return cb(template);
    }

    return template;
}

function getRender(componentName) {
    let data = JSON.stringify(getData(componentName));
    let filePath = path.join(rootFolder, 'render.html');

    if(!fs.existsSync(filePath)) {
        filePath = path.join(rootFolder, rootTemplatePath, 'render.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

function getListItem(componentName) {
    let filePath = path.join(rootFolder, 'listItem.html');

    if(!fs.existsSync(filePath)) {
        filePath = path.join(rootFolder, rootTemplatePath, 'listItem.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

function getSnippet(componentName) {
    let filePath = path.join(
        rootFolder,
        componentPath,
        componentName,
        `${componentName}.html`
    );

    if(!fs.existsSync(filePath)) {
        filePath = path.join(rootFolder, rootTemplatePath, 'snippet.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

function getIndexTemplate(componentName) {
    let filePath;
    let data;
    if(componentName) {
        data = JSON.stringify(getData(componentName));
        filePath = path.join(
            rootFolder,
            componentPath,
            componentName,
            `index.html`
        );

        if(!fs.existsSync(filePath)) {
            filePath = path.join(rootFolder, 'index.html');
        }
    }

    if(!fs.existsSync(filePath)) {
        filePath = path.join(rootFolder, rootTemplatePath, 'index.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

function webpackConf(args) {
    const webpackConfigPath = path.join(rootFolder, config.webpackConfig);
    const webpackConfig = require(webpackConfigPath);

    let jsons = components.map((componentName) => path.join(
        rootFolder,
        componentPath,
        componentName,
        `${componentName}.json`
    ));

    for(let i = 0; i < jsons.length; i++) {
        if(fs.existsSync(jsons[i])) {
            webpackConfig[0].entry.index.push(jsons[i]);
        }
    }

    if(args.indexOf('no-inline') === -1) {
        webpackConfig[0].
            entry.
            index.
            unshift(`webpack-dev-server/client?http://localhost:${port}`);
    }

    return webpackConfig;
}

function proxy(args) {
    let proxy;
    if(args.indexOf('proxy') !== -1) {
        let proxyInfo = args[args.indexOf('proxy') + 1];

        if(proxyInfo) {
            proxy = {
                '*': proxyInfo
            };
        }
    }

    return proxy;
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(function(file) {
        return fs.statSync(srcPath + '/' + file).isDirectory();
    });
}

module.exports = {
    webpackConf: webpackConf,
    renderListing: renderListing,
    renderComponent: renderComponent,
    components: components,
    proxy: proxy
};

/* eslint-enable no-undef, no-unused-vars */
