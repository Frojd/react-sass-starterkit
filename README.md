# React sass boilerplate

## Description

A slim frontend boilerplate for work with react and sass, using webpack as taskrunner and devserver for testing components. It will automatically find new components in the components folder and if you want it will reload changes automatically.

It also includes a small cli for scaffolding new components quickly.

The intended use for this boilerplate is to create components for frontend use, and not a fully working site out of the box. 
It is building the js/css files that should be used with another backend of your choise (node, django, episerver etc)

It exposes a global variable: Components
That can be used for serverside rendering in for example reactjs.net

## Installation

1. Clone the project
2. npm install

## CLI

The cli will scaffold a new component with scss, js, test and automatically add it to index.js and index.scss.

Create a component will both scss and classbase

    npm run new ComponentName

Create a component without scss file

    npm run new ComponentName no-scss

Create a component without classbase (it will be a functional component), and no scss

    npm run new ComponentName no-scss no-class


no-scss and no-class is both optional.

index.scss and index.js will be automatically updated when adding a component through the cli.

## Devserver

Use the devserver to look at your components. It is a modified version of webpack-dev-server.

Run it like this:

    npm start

And visit your list of components at: http://localhost:7000

Options:

Different port (must be first argument after start):

    npm start 4567

Prevent automatic reload on changes to component/scss

    npm start no-inline

And both port and no-inline:

    npm start 4567 no-inline

## Building css/js

For regular watch:

    npm run watch

Use this for productionbuild (uncomment the production NODE_ENV plugin first in webpack.config.js):

    webpack -p

## Throubleshooting

Using react addons? Getting trouble with multiple react loaded?
Change externals to look like this:

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/lib/ReactTransitionGroup': 'React.addons.TransitionGroup',
        'react/lib/ReactCSSTransitionGroup': 'React.addons.CSSTransitionGroup',
    },

And change vendor.js to:

    /*eslint-disable*/
    require('expose?React!react');
    require('expose?ReactDOM!react-dom');
    require('expose?React.addons.TransitionGroup!react/lib/reactTransitionGroup');
    require('expose?React.addons.CSSTransitionGroup!react/lib/ReactCSSTransitionGroup');
    /*eslint-enable*/

If you are running into similar problems with react loading multiple times, it might be that you need to add some more external library (especially if you are using the addons libraries).
