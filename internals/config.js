/**
 * The configuration
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

require('babel-register')({
    'presets': [[
        'env',
        {
            'targets': {
                'browsers': ['last 2 versions', 'safari >= 7', 'ie >= 10']
            },
            'modules': 'commonjs'
        }
    ],
    'react'
    ],
    'plugins': [
        'transform-class-properties', 
        'transform-object-rest-spread',
        'inline-react-svg'
    ]
});

const config = (argv = process.argv) => {
    let rcfile = path.join(__dirname, '/.frontendrc');
    let defaultConf = eval('(' + fs.readFileSync(rcfile, 'utf8') + ')');
    let localConf = {};

    rcfile = path.join(process.cwd(), '.frontendrc');
    if(fs.existsSync(rcfile)) {
        localConf = eval('(' + fs.readFileSync(rcfile, 'utf8') + ')');
        Object.assign(defaultConf, localConf);
    }

    if(argv && /^[0-9]+$/.test(argv[2])) {
        defaultConf.port = argv[2];
    } else {
        if(argv[3]) {
            defaultConf.componentName = argv[3];
        }
        if(argv[4]) {
            defaultConf.subComponentName = argv[4];
        }
    }

    if(argv.indexOf('proxy') !== -1) {
        if(argv[argv.indexOf('proxy') + 2]) {
            defaultConf.publicPathPrefix = argv[argv.indexOf('proxy') + 2];
        }
    }

    if(defaultConf.createPure && defaultConf.createClass) {
        throw new Error('createPure and createClass can not be true at the same time');
    }

    return defaultConf;
}

module.exports = config;

/* eslint-enable no-undef */
