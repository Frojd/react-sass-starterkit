// Port
let portNr = 7000;
if(/^[0-9]+$/.test(process.argv[2])) {
    portNr = process.argv[2];
}
const port = portNr;

// Container
const container = 'container';

/**
 * Here is custom webpack dev server
 */
// Custom webpack dev server
let webpack = require('webpack');
let webpackDevServer = require('webpack-dev-server');
let fs = require('fs');

let config = require('../webpack.config.js');
const publicPath = config[0].output.publicPath || '/';
const componentPath = config[0].context + '/components';
const folders = getDirectories(componentPath);

if(process.argv.indexOf('no-inline') === -1) {
    let jsons = folders.map((folder) => `${componentPath}/${folder}/${folder}.json`);
    for(let i = 0; i < jsons.length; i++) {
        if(fs.existsSync(jsons[i])) {
            config[0].entry.index.push(jsons[i]);
        }
    }

    config[0].entry.index.unshift('webpack-dev-server/client?http://localhost:' + port);
}

let proxy;
let proxyFrontendPath = '';
if(process.argv.indexOf('proxy') !== -1) {
    let proxyInfo = process.argv[process.argv.indexOf('proxy') + 1];
    proxyFrontendPath = process.argv[process.argv.indexOf('proxy') + 2] ?
                        process.argv[process.argv.indexOf('proxy') + 2] : '/frontend';
    if(proxyInfo) {
        proxy = {
            '*': proxyInfo
        };
    }
}

let compiler = webpack(config);
let server = new webpackDevServer(compiler, {
    contentBase: './app',
    setup: allPaths,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: {
        colors: true,
        chunks: false,
        version: false,
        hash: false,
    },
    proxy: proxy,
    publicPath: publicPath,
});
server.listen(port);

function allPaths(app) {
    let compPath = '';
    if(proxyFrontendPath) {
        compPath = proxyFrontendPath;
    }

    let files = folders.map(function(i) { return '/' + i});
    app.get(files.map((file) => `${compPath}${file}`), function(req, res) {
        let template = '';
        let snippet;
        try {
            let component = req.path.replace(compPath + '/', '');
            let data = getData(component);
            template = getComponentIndex(component, data);
            if(!template) {
                template = getTemplate(component, data);
                snippet = getSnippet(component);
                template = getMergedTemplate(template, snippet);
            }
        } catch(e) {
            console.error(e);
        }

        res.end(template);
    });

    let rootPath = `${compPath}/`;
    app.get(rootPath, function(req, res) {
        let listOfComponents = files
            .map((item) => `<a href="${compPath}${item}">${item}</a><br/>`)
            .join('');
        let template = getMergedTemplate(listOfComponents);
        res.end(template);
    })
}

function getData(component) {
    let data = {};
    let jsonComp = `${componentPath}/${component}/${component}.json`;
    try {
        data = require(jsonComp);
        purgeCache(jsonComp);
    } catch(e) {
        //console.log(e);
    }

    return data;
}

function getSnippet(component) {
    let snippet = '';
    try {
        let snippetPath = componentPath + '/' + component + '/' + component + '.html'
        snippet = fs.readFileSync(snippetPath, 'utf8');
    } catch(e) {
        //console.log(e);
    }

    return snippet;
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(srcpath + '/' + file).isDirectory();
    });
}

function getMergedTemplate(template, snippet) {
    let mergedTemplate = _baseTemplate().replace('</body>', template + '</body>');

    if(snippet && snippet.replace(/[\r\n\s]*/g, '')) {
        mergedTemplate = mergedTemplate.replace(`<div id="${container}"></div>`, snippet);
    }
    return mergedTemplate;
}

function getComponentIndex(component, data) {
    let componentIndex = '';
    try {
        let componentIndexPath = `${componentPath}/${component}/index.html`;
        componentIndex = fs.readFileSync(componentIndexPath, 'utf8');
        componentIndex = _addData(componentIndex, data);
    } catch(e) {
        //console.log(e);
    }

    return componentIndex;
}

function _baseTemplate() {
    let template;
    try {
        let path = __dirname + '../index.html';
        template = fs.readFileSync(path, 'utf8');
    } catch(e) {
        template = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>React testing ground</title>
                <script src="${publicPath}js/vendor.js"></script>
            <link rel="stylesheet" href="${publicPath}css/index.css">
            </head>
            <body>
                <div id="${container}"></div>
                <script src="${publicPath}js/index.js"></script>
            </body>
            </html>
        `
    }

    return template;
}

function _addData(template, data) {
    let jsonData = JSON.stringify(data);
    let dataTemplate = template.replace(`</head>`, `<script>var data = ${jsonData};</script></head>`);
    return dataTemplate;
}

function getTemplate(component, data = '{}', snippet = '') {
    data = JSON.stringify(data);
    component = 'Components.' + component;
    let template = `
    ${snippet}
    <script>
        ReactDOM.render(React.createElement(${component}, ${data}), document.getElementById("${container}"));
    </script>
    `;
    return template;
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
