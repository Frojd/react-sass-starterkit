let fs = require('fs');

const rootFolder = '/app';
const components = '/components/';
const scssFolder = rootFolder + '/scss/';
const componentFolder = rootFolder + components;

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
        let folderPath = __dirname + componentFolder + appName;
        if(fs.existsSync(folderPath)) {
            console.error('Component folder already exists.', appName);
            return;
        }
        try {
            fs.mkdirSync(folderPath);
            fs.writeFileSync(`${folderPath}/index.js`, this._indexTemplate(appName));
            fs.writeFileSync(`${folderPath}/${appName}.html`, this._emptyTemplate());
            fs.writeFileSync(`${folderPath}/${appName}.json`, this._dataTemplate());
            fs.writeFileSync(`${folderPath}/${appName}.test.js`, this._testTemplate(appName));
            fs.writeFileSync(`${__dirname}${componentFolder}/index.js`, this._updateIndex(appName));
            if(process.argv.indexOf('class') !== -1) {
                fs.writeFileSync(`${folderPath}/${appName}.js`, this._componentClassTemplate(appName));
            } else {
                fs.writeFileSync(`${folderPath}/${appName}.js`, this._componentTemplate(appName));
            }

            if(process.argv.indexOf('scss') !== -1) {
                fs.writeFileSync(`${folderPath}/${appName}.scss`, this._scssTemplate(appName));
                fs.writeFileSync(`${__dirname}${scssFolder}/index.scss`, this._updateScss(appName));
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

const ${appName} = () => {
    return (
        <div className="${appName.toLowerCase()}">
            ${appName}
        </div>
    )
};

export default ${appName};
        `

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
            <div className="${appName.toLowerCase()}">
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
        let template = `{}
        `;
        return template;
    }

    _emptyTemplate() {
        let template = ``;

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
        let template = `.${appName.toLowerCase()} {

}`;

        return template;
    }

    _updateIndex(appName) {
        let index = fs.readFileSync(__dirname + componentFolder + 'index.js', 'utf8');
        let newComponent = `import ${appName} from './${appName}';
`
        index = newComponent.concat(index);

        index = index.replace(`export {`, `export {
    ${appName},`)
        return index;
    }

    _updateScss(appName) {
        let index = fs.readFileSync(__dirname + scssFolder + 'index.scss', 'utf8');
        let importString = `@import '..${components}${appName}/${appName}.scss';`

        index = index.concat(importString);
        return index;
    }
}

new Cli();
