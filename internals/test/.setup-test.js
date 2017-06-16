require('babel-register')({
    "presets": [[
        "env",
        {
            "targets": {
                "browsers": ["last 2 versions", "safari >= 7", "ie >= 10"]
            },
            "modules": "commonjs"
        }
        ],
        "react"
    ],
    "plugins": ["transform-class-properties", "transform-object-rest-spread"]
});

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;
