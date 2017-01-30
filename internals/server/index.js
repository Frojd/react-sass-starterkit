/**
 * Internals of the custom webpack devserver setup
 */

/* eslint-disable no-undef, no-unused-vars */

const fs = require('fs');
const path = require('path');

const config = require('../config')();

// Global variables for templates
const root = process.cwd();
const rootTemplatePath = config.rootServerTemplatePath;
const publicPath = config.publicPath;
const containerId = config.containerId;
const port = config.port;
const publicPathPrefix = config.publicPathPrefix;
const componentPath = path.join(config.rootFolder, config.componentsFolder);
const context = config.context;
const components = getDirectories(path.join(root, componentPath));

const renderComponent = (componentName, cb) => {
    let index = getIndexTemplate(componentName);
    let snippet = getSnippet(componentName);
    let render = getRender(componentName);
    let template = index.replace('<!-- content -->', snippet).replace('<!-- react-render -->', render);

    if(cb) {
        return cb(template);
    }

    return template;
}

const renderListing = (cb) => {
    let listOfComponents = components.map((componentName) =>
        getListItem(componentName)
    ).join('');

    let template = getIndexTemplate().replace('<!-- content -->', listOfComponents);

    if(cb) {
        return cb(template);
    }

    return template;
}

const getData = (componentName) => {
    let data = {};
    let jsonComp = path.join(
        root,
        componentPath,
        componentName,
        `${componentName}.json`
    )

    if(fs.existsSync(jsonComp)) {
        data = require(jsonComp);
        purgeCache(jsonComp);
    }

    return data;
}

const getRender = (componentName) => {
    let data = JSON.stringify(getData(componentName));
    let filePath = path.join(root, 'render.html');

    if(!fs.existsSync(filePath)) {
        filePath = path.join(root, rootTemplatePath, 'render.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

const getListItem = (componentName) => {
    let filePath = path.join(root, 'listItem.html');

    if(!fs.existsSync(filePath)) {
        filePath = path.join(root, rootTemplatePath, 'listItem.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

const getSnippet = (componentName) => {
    let filePath = path.join(
        root,
        componentPath,
        componentName,
        `${componentName}.html`
    );

    if(!fs.existsSync(filePath)) {
        filePath = path.join(root, rootTemplatePath, 'snippet.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

const getIndexTemplate = (componentName) => {
    let filePath;
    if(componentName) {
        filePath = path.join(
            root,
            componentPath,
            componentName,
            `index.html`
        );

        if(!fs.existsSync(filePath)) {
            filePath = path.join(root, 'index.html');
        }
    }

    if(!fs.existsSync(filePath)) {
        filePath = path.join(root, rootTemplatePath, 'index.html');
    }

    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

const webpackConf = (args) => {
    const webpackConfigPath = path.join(root, config.webpackConfig);
    const webpackConfig = require(webpackConfigPath);

    let jsons = components.map((componentName) => path.join(
        root,
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

const proxy = (args) => {
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

/* eslint-disable */
// Removes cached json
// Taken from http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
};
/* eslint-enable */

module.exports = {
    webpackConf: webpackConf,
    renderListing: renderListing,
    renderComponent: renderComponent,
    components: components,
    proxy: proxy
};

/* eslint-enable no-undef, no-unused-vars */
