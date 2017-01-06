const fs = require('fs');
const readline = require('readline');

const ROOT_FOLDER = '/app';
const COMPONENTS_FOLDER = '/components/';
const SCSS_FOLDER = '/scss/';
const SCSS_PATH = ROOT_FOLDER + SCSS_FOLDER;
const COMPONENTS_PATH = ROOT_FOLDER + COMPONENTS_FOLDER;
const BASE_PATH = __dirname + '/..';

const FLAG_NO_CLASS = 'no-class';
const FLAG_NO_SCSS = 'no-scss';
const FLAG_ADD_HTML = 'add-html';


const updateFile = (path, data, message = 'Updated') => {
    writeFile(path, data, 'Updated');
}

const writeFile = (path, data, message = 'Added') => {
    let name = path.split(BASE_PATH + ROOT_FOLDER)[1];
    fs.writeFileSync(path, data);
    console.log(message + ' ' + name);
}

const deleteFolderRecursive = (path) => {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            let curPath = `${path}/${file}`;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                console.log('Deleted file', curPath);
                fs.unlinkSync(curPath);
            }
        });
        console.log('Deleted folder', path);
        fs.rmdirSync(path);
    }
}

class Cli {
    constructor() {
        let [ action, componentName, componentsFolder ] = process.argv.slice(2);

        if ([FLAG_NO_CLASS, FLAG_NO_SCSS, FLAG_ADD_HTML].indexOf(componentsFolder) !== -1) {

            componentsFolder = undefined;
        }

        if(process.argv.length < 4) {
            console.log('new requires a third argument: "new MyComponentName"');
            return;
        }

        if(!/^[A-Za-z0-9\-\_]+$/.test(componentName)) {
            console.log(`ComponentName "${componentName}" is not valid`);
            return;
        }

        componentsFolder = componentsFolder ? `/${componentsFolder}/` : null;
        componentsFolder = componentsFolder || COMPONENTS_FOLDER;

        switch (action) {
            case 'new':
                this.startApp(componentName, componentsFolder);
                break;

            case 'delete':
                this.deleteApp(componentName, componentsFolder);
                break;
        }
    }

    startApp(appName, componentsFolder) {
        const componentsPath = BASE_PATH + ROOT_FOLDER + componentsFolder;
        const appPath = BASE_PATH + ROOT_FOLDER + componentsFolder + appName;

        if(fs.existsSync(appPath)) {
            console.error('Component folder already exists.', appName);
            return;
        }

        try {
            fs.mkdirSync(appPath);
            fs.writeFileSync(`${appPath}/index.js`, this._indexTemplate(appName));

            if(process.argv.indexOf(FLAG_ADD_HTML) !== -1) {
                writeFile(`${appPath}/${appName}.html`, this._emptyTemplate());
            }

            writeFile(`${appPath}/${appName}.json`, this._dataTemplate());
            writeFile(`${appPath}/${appName}.test.js`, this._testTemplate(appName));
            updateFile(`${componentsPath}index.js`, this._updateIndex(appName, componentsFolder));

            if(process.argv.indexOf(FLAG_NO_CLASS) !== -1) {
                writeFile(`${appPath}/${appName}.js`, this._componentTemplate(appName));
            } else {
                writeFile(`${appPath}/${appName}.js`, this._componentClassTemplate(appName));
            }

            if(process.argv.indexOf(FLAG_NO_SCSS) === -1) {
                writeFile(`${appPath}/${appName}.scss`, this._scssTemplate(appName));
                updateFile(`${BASE_PATH}${SCSS_PATH}index.scss`, this._updateScss(appName, componentsFolder));
            }

        } catch(e) {
            console.error(e);
        }

        console.log(`Component '${appName}' has been created.`);
    }

    deleteApp(appName, componentsFolder) {
        const componentsPath = BASE_PATH + ROOT_FOLDER + componentsFolder;
        const appPath = BASE_PATH + ROOT_FOLDER + componentsFolder + appName;

        if(!fs.existsSync(appPath)) {
            console.error('Component folder does not exist.', appName);
            return;
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let files = fs.readdirSync(appPath).filter(function(file) {
            return fs.statSync(appPath + '/' + file);
        });
        const deleteString = `@import '..${componentsFolder}${appName}/${appName}.scss'`;
        const newComponent = `import ${appName} from './${appName}'`;
        rl.question(
`You will delete these files in component ${appName} on this path
${appPath}/:\n
${files.join('\n')}\n
This from index.js:
${newComponent}
${appName},\n
This from index.scss:
${deleteString}\n
Are you sure? (yes/no): `,
            (answer) => {
                if(answer === 'yes') {
                    deleteFolderRecursive(appPath);
                    fs.writeFileSync(`${BASE_PATH}${SCSS_PATH}/index.scss`, this._deleteScss(appName, componentsFolder));
                    fs.writeFileSync(`${componentsPath}/index.js`, this._deleteIndex(appName, componentsFolder));
                    console.log(`Deleted component ${appName}`);
                } else {
                    console.log(`Exited without deletion.`);
                }

                rl.close();
            }
        );
    }

    _indexTemplate(appName) {
        let template = `import ${appName} from './${appName}';

export default ${appName};
`;

        return template;
    }

    _componentTemplate(appName) {
        let template = `/**
 * ${appName}
 */

import React from 'react';

const ${appName} = ({ title }) => (
    <div className="${appName}">
        ${appName} - {title}
    </div>
);

export default ${appName};
`;

        return template;
    }

    _componentClassTemplate(appName) {
        let template = `/**
 * ${appName}
 */

import React from 'react';

class ${appName} extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="${appName}">
                ${appName}
            </div>
        );
    }
}

${appName}.defaultProps = {
};

export default ${appName};
`;

        return template;
    }

    _dataTemplate() {
        const template = `{}`;
        return template;
    }

    _emptyTemplate() {
        const template = ``;

        return template;
    }

    _testTemplate(appName) {
        let template = `import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ${appName} from './';
import data from './${appName}.json';

describe('<${appName} />', () => {
    it('Renders an empty ${appName}', () => {
        const wrapper = mount(<${appName} />);
        expect(wrapper.find(${appName})).to.have.length(1);
    });

    it('Renders ${appName} with data', () => {
        const wrapper = mount(<${appName} {...data} />);
        expect(wrapper.find(${appName})).to.have.length(1);
    });
});
`;
        return template;
    }

    _scssTemplate(appName) {
        let template = `.${appName} {

}`;

        return template;
    }

    _updateIndex(appName, componentsFolder = COMPONENTS_FOLDER) {
        const componentsPath = BASE_PATH + ROOT_FOLDER + componentsFolder;
        let index = fs.readFileSync(componentsPath + 'index.js', 'utf8');
        let newComponent = `import ${appName} from './${appName}';
`;
        index = newComponent.concat(index);

        index = index.replace(`export {`, `export {
    ${appName},`);
        return index;
    }

    _deleteIndex(appName, componentsFolder = COMPONENTS_FOLDER) {
        const componentsPath = BASE_PATH + ROOT_FOLDER + componentsFolder;
        let index = fs.readFileSync(componentsPath + 'index.js', 'utf8');
        let newComponent = `import ${appName} from './${appName}';
`;
        index = index.replace(newComponent, '');

        index = index.replace(
`    ${appName},
`, '');
        return index;
    }

    _updateScss(appName, componentsFolder = COMPONENTS_FOLDER) {
        let index = fs.readFileSync(BASE_PATH + SCSS_PATH + 'index.scss', 'utf8');
        const importString = `@import '..${componentsFolder}${appName}/${appName}.scss';
`;

        index = index.concat(importString);
        return index;
    }

    _deleteScss(appName, componentsFolder = COMPONENTS_FOLDER) {
        let index = fs.readFileSync(BASE_PATH + SCSS_PATH + 'index.scss', 'utf8');
        const deleteString = `@import '..${componentsFolder}${appName}/${appName}.scss';
`;

        index = index.replace(deleteString, '');
        return index;
    }
}

new Cli();
