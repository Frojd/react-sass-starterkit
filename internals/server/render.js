/* eslint-disable no-unused-vars */

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

class Render {
    constructor(config) {
        this.config = config;
        this.componentsFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        this.templatePath = path.join(
            process.cwd(),
            this.config.rootServerTemplatePath
        )
    }

    renderComponent(componentName) {
        const index = this.getIndexTemplate();
        const snippet = this.getSnippet();
        const data = JSON.stringify({});
        const components = this.getComponents();
        const containers = this.getContainers();
        const template = index.replace('<!-- content -->', snippet);
        const evaluatedTemplate = eval('`' + template + '`');
        return evaluatedTemplate;
    }

    renderListing() {
        const config = this.config;
        const componentName = '';
        const index = this.getIndexTemplate();
        const listingItemTemplate = this.getListItem();
        const components = this.getComponents();
        const containers = this.getContainers();
        const listing = components.map((componentName) => {
            return eval('`' + listingItemTemplate + '`');
        });
        const componentListing = components.map((componentName) => {
            return eval('`' + listingItemTemplate + '`');
        }).join('');
        const containerListing = containers.map((componentName) => {
            return eval('`' + listingItemTemplate + '`');
        }).join('');

        const cmpStr = `<h2 class='devserver__title'>Containers</h2>
        ${containerListing}<br />
        <h2 class='devserver__title'>Components</h2>
        ${componentListing}`;
        const template = index.replace('<!-- content -->', cmpStr);
        const evaluatedTemplate = eval('`' + template + '`');
        return evaluatedTemplate;
    }

    getWebpackConfig() {
        const webpackConfigPath = path.resolve(
            this.config.rootFolder,
            this.config.webpackConfig
        );
        
        const webpackConfig = require(webpackConfigPath);
        const components = this.getComponents();
        let jsons = components.map((componentName) => path.resolve(
            this.componentsFolder,
            componentName,
            `${componentName}.json`
        ));
    
        for(let i = 0; i < jsons.length; i++) {
            if(fs.existsSync(jsons[i])) {
                webpackConfig[0].entry.index.push(jsons[i]);
            }
        }
        //const containerJsPath = path.resolve(this.templatePath, 'Container.js');
        const indexOfindexJs = webpackConfig[0].entry.index.findIndex((i) => {
            return i === './index.js'
        });
        
        webpackConfig[0].entry.index[indexOfindexJs] = './Container.js';//containerJsPath;
        webpackConfig[0].entry.index.unshift(
            `react-hot-loader/patch`,
            `webpack-dev-server/client?http://localhost:${this.config.port}/`, 
            `webpack/hot/dev-server`
        );

        webpackConfig[0].plugins.push(new webpack.NamedModulesPlugin())
        webpackConfig[0].plugins.push(new webpack.HotModuleReplacementPlugin())
        webpackConfig[2].plugins.push(new BrowserSyncPlugin(
            // BrowserSync options
            {
                // browse to http://localhost:3000/ during development
                host: 'localhost',
                port: `${parseInt(this.config.port) + 1}`,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                proxy: `http://localhost:${parseInt(this.config.port)}/`
            },
            // plugin options
            {
                injectCss: true,
                reload: true
            }
        ));
        
        return webpackConfig;
    }

    getComponents() {
        const componentsFolder = path.join(
            this.config.rootFolder,
            this.config.appFolder,
            this.config.componentsFolder,
        )
        
        const components = fs.readdirSync(componentsFolder).filter((file) => {
            return fs.statSync(componentsFolder + '/' + file).isDirectory();
        });
        
        return components;
    }

    getContainers() {
        const containersFolder = path.join(
            this.config.rootFolder,
            this.config.appFolder,
            this.config.containersFolder,
        )

        const containers = fs.readdirSync(containersFolder).filter((file) => {
            return fs.statSync(containersFolder + '/' + file).isDirectory();
        });

        return containers;
    }

    getIndexTemplate() {
        const template = this._getTemplate('index.html');
        return template;
    }

    getSnippet() {
        const template = this._getTemplate('snippet.html');
        return template;
    }

    getListItem() {
        const template = this._getTemplate('listItem.html');
        return template;
    }

    _getTemplate(templateName) {
        let templatePath = path.join(
            this.templatePath,
            templateName
        );

        let template = fs.readFileSync(templatePath, 'utf8');
        return template;
    }
}

module.exports = Render;