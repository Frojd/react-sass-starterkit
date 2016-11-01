const fs = require('fs');

const rootFolder = '/app';
const components = '/components/';
const scssFolder = rootFolder + '/scss/';
const componentFolder = rootFolder + components;
const baseFolder = __dirname + '/..';

class Cli {
    constructor() {
        if(process.argv[2] === 'new') {
            if(process.argv[3] && /^[A-Za-z0-9\-\_]+$/.test(process.argv[3])) {
                this.startapp(process.argv[3]);
            } else {
                console.log('new requires a third argument: "new mycomponentname"');
            }
        }
    }

    startapp(appName) {
        let folderPath = baseFolder + componentFolder + appName;
        if(fs.existsSync(folderPath)) {
            console.error('Component folder already exists.', appName);
            return;
        }
        try {
            fs.mkdirSync(folderPath);
            fs.writeFileSync(`${folderPath}/index.js`, this._indexTemplate(appName));

            if(process.argv.indexOf('add-html') !== -1) {
                fs.writeFileSync(`${folderPath}/${appName}.html`, this._emptyTemplate());
                console.log(`Added ${appName}.html`);
            }

            fs.writeFileSync(`${folderPath}/${appName}.json`, this._dataTemplate());
            console.log(`Added ${appName}.json`);
            fs.writeFileSync(`${folderPath}/${appName}.test.js`, this._testTemplate(appName));
            console.log(`Added ${appName}.test.js`);
            fs.writeFileSync(`${baseFolder}${componentFolder}/index.js`, this._updateIndex(appName));
            console.log(`Updated index.js`);
            if(process.argv.indexOf('no-class') !== -1) {
                fs.writeFileSync(`${folderPath}/${appName}.js`, this._componentTemplate(appName));
                console.log(`Added ${appName}.js`);
            } else {
                fs.writeFileSync(`${folderPath}/${appName}.js`, this._componentClassTemplate(appName));
                console.log(`Added ${appName}.js`);
            }

            if(process.argv.indexOf('no-scss') === -1) {
                fs.writeFileSync(`${folderPath}/${appName}.scss`, this._scssTemplate(appName));
                console.log(`Added ${appName}.scss`);
                fs.writeFileSync(`${baseFolder}${scssFolder}/index.scss`, this._updateScss(appName));
                console.log(`Updated index.scss`);
            }

        } catch(e) {
            console.error(e);
        }

        console.log(`Component '${appName}' has been created.`);
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
        const template = `{}
        `;
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

    _updateIndex(appName) {
        let index = fs.readFileSync(baseFolder + componentFolder + 'index.js', 'utf8');
        let newComponent = `import ${appName} from './${appName}';
`;
        index = newComponent.concat(index);

        index = index.replace(`export {`, `export {
    ${appName},`);
        return index;
    }

    _updateScss(appName) {
        let index = fs.readFileSync(baseFolder + scssFolder + 'index.scss', 'utf8');
        const importString = `@import '..${components}${appName}/${appName}.scss';
`;

        index = index.concat(importString);
        return index;
    }
}

new Cli();
