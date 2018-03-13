# React sass starterkit

## Description

An opinoated frontend boilerplate for work with react and sass, using webpack as taskrunner and devserver for testing components. It will automatically find new components in the components folder and if you want it will reload changes automatically.

It also includes a small cli for scaffolding new components quickly.

The intended use for this boilerplate is to create components for frontend use, and not a fully working site out of the box. 
It is building the js/css/img/fonts files that should be used with another backend of your choise (node, django, episerver etc)

It exposes a global variable: Components
That can be used for serverside rendering in for example reactjs.net

## Installation and quickstart

1. Clone the project
2. `npm install`
3. `npm run new MyComponent`
4. `npm start`
5. Done!

Visit [http://localhost:7001](http://localhost:7001) and look at the component you just created. It should autoopen when running the start command.

## CLI

The cli will scaffold a new component with scss, js, test and automatically add it to index.js and index.scss.

Create a component will both scss and classbase

    npm run new ComponentName

Delete a component that have been created with the cli

    npm run delete ComponentName

index.scss and index.js will be automatically updated when adding a component through the cli.

Subcomponents can be created as well:

    npm run new ComponentName SubComponentName

This will create a new component inside the first component. Subcomponents can be added as many levels down as you need.

Container components:

    npm run new ContainerName -- -C containers

This will add a new component inside the containers folder (and also add the scss file to index.scss)

## Devserver

Use the devserver to look at your components. It is a modified version of webpack-dev-server.

Run it like this:

    npm start

And visit your list of components at: [http://localhost:7000](http://localhost:7000)

## Building css/js

For regular watch:

    npm run watch

For a fullscale watch (serverside, testserver, files):

    npm run multiwatch

For a regular build:

    npm run build

For productionbuild

    npm run build:prod

For all tests:

    npm test

For single test:

    npm test MyComponent

## Publishing static files

There is now commands for publishing an index.html file that will use a component and serverrender it (then clientrender on top) for use on example Amazon S3 as a static site. By default it will also run the taskrunner for building assets.

    npm run publish ComponentName

Will create index.html in the dist folder (ie dist/index.html)

    npm run publish ComponentName subfolder

Will create index.html in the Subfolder to dist (ie dist/subfolder/index.html)

    npm run publish ComponentName filename.html

Will create filename.html in the dist folder (ie dist/filename.html). This will only work if you specify .html as the ending on filename, else it will create it as a folder.

    npm run publish ComponentName subfolder filename.html

Will create filename.html in subfolder to dist (ie dist/subfolder/filename.html)

For production version of scripts, use publish:prod instead ie:

    npm run publish:prod ComponentName

To only create the html file without running the taskrunner for assets, use publish:only

    npm run publish:only ComponentName

This will only create the html file without any building of assets.

You can also publish all components, to work the same as the devserver:

    npm run publish:all

The html files will default to the "outputPathHtmlFolder" setting

## .frontendrc and overrides

The recommended way to change settings is by overriding the .frontendrc file that exists in internals folder.

Copy the .frontendrc file and place it in the root folder, next to webpack.config.js, then change the values to what you would need.

Current settings are:

```javascript
// All paths are relative to the application root
{
    // General
    "outputPath": "dist", // Where files will be placed when using watch or build
    "outputPathSubFolder": "static", // Subfolder where the files will be placed in output path 
    "outputPathJsFolder": "js", // Folder for javascript
    "outputPathCssFolder": "css", // Folder for css
    "outputPathHtmlFolder": "dist/html", // Folder for html (empty will place in root)
    "webpackConfig": "./webpack.config.js", // Config used
    "appFolder": "app", // Foldername for the application
    "componentsFolder": "components", // Foldername where components will be created
    "useServerRendering": false, // Use server rendering on develop, note that this requires restart of devserver on each change
    "useServerRenderingOnPublish": true, // Use server rendering when publishing a html file

    // Server
    "port": 7000,
    "rootServerTemplatePath": "/internals/templates/server/", // Templatefolder for servertemplates
    "publicPath": "/static/", // External static path

    // Cli
    "rootCliTemplatePath": "/internals/templates/cli/", // Templatefolder for cli
    "scssFolder": "scss", // Folder for scss files
    "createScss": true, // Create a scss file with the component
    "createClass": true, // Create the class version of a react component
    "createPure": false, // Create the functional version of a react component
    "createIndex": true, // Create an index.js file inside the ComponentName folder
    "createData": true, // Create a ComponentName.json
    "createTest": true, // Create a ComponentName.test.js for unittesting
    "updateIndexScss": true, // Updated the default index.scss with the new component
    "updateIndexJs": true // Updated the index.js with the new component
}
```

## Overriding templates

Currently all templates can be overridden, they all exists in internals/templates/cli and interal/templates/server

Recommended way is to copy the templatefolders and change the rootServerTemplatePath and rootCliTemplatePath in .frontendrc file

## Throubleshooting and support

### Using react addons? Getting trouble with multiple react loaded?

Change externals to look like this in your webpack.config.js

```javascript
externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react/lib/ReactTransitionGroup': 'React.addons.TransitionGroup',
    'react/lib/ReactCSSTransitionGroup': 'React.addons.CSSTransitionGroup',
},
```

And change vendor.js to:

```javascript
/*eslint-disable no-undef*/
require('expose-loader?React!react');
require('expose-loader?ReactDOM!react-dom');
require('expose-loader?React.addons.CSSTransitionGroup!react/lib/ReactCSSTransitionGroup');
/*eslint-enable no-undef*/
```

If you are running into similar problems with react loading multiple times, it might be that you need to add some more external library (especially if you are using the addons libraries).

### Using jQuery and plugins?

To use jquery and with old plugins you can with ease use the script loader for webpack (`npm install script-loader`), and add them both to vendor.js in a similar way as react is done (require the addon after you expose jquery).

```javascript
require('expose-loader?jQuery!jquery');
require('script-loader!jquery.flipster');  // Example plugin
```

### Serverside rendering

There is support to compile out the components with babel only:

    npm run ssr
    npm run ssr:watch

These components can with ease be used together with for example [Hastur](https://github.com/Frojd/Hastur) to create serverside rendering for your project.

#### window is not defined

Common problem with serverside rendering, if you are using window on pre componentDidMount, you will need to check if it exists. Preferably thou you will need to set a state in componentDidMount for it to be rendered correctly on the serverside, however just to check if window exists you can write this:

```javascript
if(typeof window !== 'undefined') {
    // do you window things here
}
```

## License

react-sass-starterkit is released under the [MIT License](http://www.opensource.org/licenses/MIT).
