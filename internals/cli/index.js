/**
 * Internal handling of creating components
 */

/*eslint-disable no-undef*/

const path = require('path');
const fs = require('fs');
const readline = require('readline');

const config = require('../config')();
const rootFolder = process.cwd();
const componentsFolder = path.join(rootFolder, config.appFolder, config.componentsFolder);
const scssFolder = path.join(rootFolder, config.appFolder, config.scssFolder);
const templatePath = path.join(rootFolder, config.rootCliTemplatePath);
const componentName = config.componentName;
const folderPath = path.join(componentsFolder, componentName);
let files;

function createNewComponent() {
    if(fs.existsSync(folderPath)) {
        console.error('Component folder already exists.', componentName);
        return;
    }

    try {
        fs.mkdirSync(folderPath);

        if(config.createIndex) {
            createIndex();
        }

        if(config.createHtml) {
            createHtml();
        }
        if(config.createData) {
            createData();
        }

        if(config.createTest) {
            createTest();
        }

        if(config.createPure) {
            createJs(true);
        }

        if(config.createClass) {
            createJs();
        }

        if(config.createScss) {
            createScss();
        }

        if(config.updateIndexJs) {
            updateIndexJs();
        }

        if(config.updateIndexScss) {
            updateIndexScss();
        }
    } catch(e) {
        console.error('Error while creating component:', e);
    }
}

function deleteComponent() {
    if(!fs.existsSync(folderPath)) {
        console.error('Component folder does not exist.', componentName);
        return;
    }
    files = fs.readdirSync(folderPath).filter(function(file) {
        return fs.statSync(folderPath + '/' + file);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const question = _getTemplate('deleteQuestion');
    rl.question(question,
        (answer) => {
            if(answer === 'yes') {
                _deleteFolderRecursive(folderPath);
                updateIndexScss(true);
                updateIndexJs(true);
                console.log(`Deleted component ${componentName}`);
            } else {
                console.log(`Exited without deletion.`);
            }

            rl.close();
        }
    );
}

function createScss() {
    let template = _getTemplate('componentScss');
    let filePath = `${folderPath}/${componentName}.scss`;
    _writeFile(filePath, template);
    _log(`Created scss: ${filePath}`);
}

function createJs(usePure = false) {
    let templateName = usePure ? 'componentPure' : 'componentClass';
    let template = _getTemplate(templateName);
    let filePath = `${folderPath}/${componentName}.js`;
    _writeFile(filePath, template);
    _log(`Created js: ${filePath}`);
}

function createIndex() {
    let template = _getTemplate('componentIndex');
    let filePath = `${folderPath}/index.js`;
    _writeFile(filePath, template);
    _log(`Created index: ${filePath}`);
}

function createData() {
    let template = _getTemplate('componentData');
    let filePath = `${folderPath}/${componentName}.json`;
    _writeFile(filePath, template);
    _log(`Created data: ${filePath}`);
}

function createTest() {
    let template = _getTemplate('componentTest');
    let filePath = `${folderPath}/${componentName}.test.js`;
    _writeFile(filePath, template);
    _log(`Created test: ${filePath}`);
}

function createHtml() {
    let template = _getTemplate('componentHtml');
    let filePath = `${folderPath}/${componentName}.html`;
    _writeFile(filePath, template);
    _log(`Created html: ${filePath}`);
}

function updateIndexJs(remove = false) {
    let filePath = path.join(componentsFolder, 'index.js')
    let index = fs.readFileSync(filePath, 'utf8');
    let newComponent = `import ${componentName} from './${componentName}';
`;

    if(remove) {
        index = index.replace(newComponent, '');
        index = index.replace(
`
    ${componentName},`, '');
    } else {
        index = newComponent.concat(index);
        index = index.replace(`export {`, `export {
    ${componentName},`);
    }

    _writeFile(filePath, index);
    _log(`Updated index.js: ${filePath}`)
}

function updateIndexScss(remove = false) {
    let filePath = path.join(scssFolder, 'index.scss')
    let index = fs.readFileSync(filePath, 'utf8');
    const importString = `@import '../${config.componentsFolder}/${componentName}/${componentName}';
`;

    if(remove) {
        index = index.replace(importString, '');
    } else {
        index = index.concat(importString);
    }

    _writeFile(filePath, index);
    _log(`Updated index.scss: ${filePath}`)
}

function _writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
    } catch(e) {
        console.error(`Failed to write filepath ${filePath} with content ${content}`, e);
    }
}

function _getTemplate(templateName) {
    let filePath = path.join(templatePath, templateName);
    let template = eval('`' + fs.readFileSync(filePath, 'utf8') + '`');
    return template;
}

function _deleteFolderRecursive(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            let curPath = `${path}/${file}`;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                _deleteFolderRecursive(curPath);
            } else { // delete file
                console.log('Deleted file', curPath);
                fs.unlinkSync(curPath);
            }
        });
        console.log('Deleted folder', path);
        fs.rmdirSync(path);
    }
}

function _log(message) {
    console.log(message);
}

module.exports = {
    createNewComponent,
    deleteComponent
};

/*eslint-enable no-undef*/
