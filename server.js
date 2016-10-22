// Settings here:
// Absolute path to components folder:
const componentPath = __dirname + '/app/components';

// Port
const port = 7000;

// Container
const container = 'container';

/**
 * Here is custom webpack dev server
 */
// Custom webpack dev server
let webpack = require('webpack');
let webpackDevServer = require('webpack-dev-server');
let fs = require('fs');

let config = require('./webpack.config.js');
let compiler = webpack(config);
let server = new webpackDevServer(compiler, {
    contentBase: config[0].output.publicPath,
    // hot: true,
    setup: allPaths,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true }
});
server.listen(port);

function allPaths(app) {
    let files = getDirectories(componentPath);
    files = files.map(function(i) { return '/' + i});
    app.get(files, function(req, res) {
        let template = '';
        let snippet;
        try {
            let component = req.path.replace('/', '');
            template = getTemplate(component, getData(component));
            snippet = getSnippet(component);
        } catch(e) {
            console.error(e);
        }

        res.end(getMergedTemplate(template, snippet));
    });

    app.get('/', function(req, res) {
        let listOfComponents = files.map(function(item) { return `<a href="${item}">${item}</a><br/>`}).join();
        let template = getMergedTemplate(listOfComponents);
        res.end(template);
    })
}

function getData(component) {
    let data = {};
    try {
        data = require(componentPath + '/' + component + '/' + component + '.json');
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
    if(snippet) {
        mergedTemplate = mergedTemplate.replace(`<div id="${container}"></div>`, snippet);
    }
    return mergedTemplate;
}

function _baseTemplate() {
    let template;
    try {
        let path = __dirname + '/index.html';
        template = fs.readFileSync(path, 'utf8');
    } catch(e) {
        template = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>React testingground</title>
              <script src="/js/vendor.bundle.js"></script>
              <script src="/webpack-dev-server.js"></script>
              <link rel="stylesheet" href="/css/index.css">
            </head>
            <body>
            <div id="${container}"></div>
            <script src="/js/index.js"></script>

            </body>
            </html>
        `
    }

    return template;
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
