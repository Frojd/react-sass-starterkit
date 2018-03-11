/* eslint-disable no-undef, no-unused-vars */

const fs = require('fs');
const path = require('path');

const config = require('../config')();

const rootFolder = process.cwd();
const componentPath = path.join(config.appFolder, config.componentsFolder);


function getData(componentName) {
    let data = {};
    let jsonComp = path.join(
        rootFolder,
        componentPath,
        componentName,
        `${componentName}.json`
    )

    if(!fs.existsSync(jsonComp)) {
        jsonComp = path.join(
            rootFolder,
            componentPath,
            componentName,
            `${componentName}.json`
        )
    }

    if(fs.existsSync(jsonComp)) {
        data = require(jsonComp);
        purgeCache(jsonComp);
        let jsonString = JSON.stringify(data);
        let res = jsonString.replace(/"###(.*?)###"/g, function(org, catched) {
            let subData = JSON.stringify(getData(catched));
            return subData;
        });

        data = JSON.parse(res);
    }

    return data;
}

function purgeCache(moduleName) {
    Object.keys(require.cache).forEach(function(key) {
        
        delete require.cache[key];
        
    });
}

class Log {
    static info(message) {
        console.info(message);
    }
    static error(message) {
        console.error(message);
    }
}

module.exports = {
    getData,
    Log
}
