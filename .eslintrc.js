module.exports = {
    "settings": {
        "react": {
            "version": "detect",
        }
    },
    "env": {
        "browser": true,
        "es6": true,
        "jest": true,
        "node": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jsx-a11y"
    ],

    "rules": {
        "react/display-name": 0,
        "indent": [2, 4, { "SwitchCase": 1 }],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
