# React sass starterkit

## Description

A slim frontend boilerplate for work with react and sass, using webpack as taskrunner and devserver for testing components. It will automatically find new components in the components folder and if you want it will reload changes automatically.

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

Visit [http://localhost:7000](http://localhost:7000) and look at the component you just created.

## CLI

The cli will scaffold a new component with scss, js, test and automatically add it to index.js and index.scss.

Create a component will both scss and classbase

    npm run new ComponentName

Delete a component that have been created with the cli

    npm run delete ComponentName

index.scss and index.js will be automatically updated when adding a component through the cli.

## Devserver

Use the devserver to look at your components. It is a modified version of webpack-dev-server.

Run it like this:

    npm start

And visit your list of components at: [http://localhost:7000](http://localhost:7000)

Options:

Different port (must be first argument after start):

    npm start 4567

### Proxy ###

All requests to the staticPath will go through the webpack devserver, also all components and / will do that as well.

You can start the devserver with proxy with this command (change domain and port to your local devserver):

    npm start proxy http://local.dev:8080

Or by using ip, for instance:

    npm start proxy http://127.0.0.1:8080

By default the components will be served from / when using proxy, so to be able to serve your backendpages instead you should specify a different publicPathPrefix in .frontendrc, then the components will be served from that folder instead and the / will be served from your proxy.

This can also be added through specifying a folder after the proxy address, eg:

    npm start proxy http://local.dev:8080 /components/

And then you can see your components on [http://localhost:7000/components/](http://localhost:7000/components/)

## Building css/js

For regular watch:

    npm run watch

For a regular build:

    npm run build

For productionbuild

    npm run build:prod

For all tests:

    npm run test

For single test:

    npm run test:single app\components\ComponentName\ComponentName.test.js

## Publishing static files ##

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

## .frontendrc and overrides ##

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
    "outputPathHtmlFolder": "", // Folder for html (empty will place in root)
    "webpackConfig": "./webpack.config.js", // Config used
    "appFolder": "app", // Foldername for the application
    "componentsFolder": "components", // Foldername where components will be created
    "containerId": "root", // Default container id that components will be rendered into
    "useServerRendering": false, // Use server rendering on develop, note that this requires restart of devserver on each change
    "useServerRenderingOnPublish": true, // Use server rendering when publishing a html file

    // Server
    "port": 7000,
    "rootServerTemplatePath": "/internals/templates/server/", // Templatefolder for servertemplates
    "publicPathPrefix": "/", // Used with the proxy, to separate the componentindex from /
    "publicPath": "/static/", // External static path

    // Cli
    "rootCliTemplatePath": "/internals/templates/cli/", // Templatefolder for cli
    "scssFolder": "scss", // Folder for scss files
    "createScss": true, // Create a scss file with the component
    "createHtml": false, // Create a ComponentName.html with the component
    "createClass": true, // Create the class version of a react component
    "createPure": false, // Create the functional version of a react component
    "createIndex": true, // Create an index.js file inside the ComponentName folder
    "createData": true, // Create a ComponentName.json
    "createTest": true, // Create a ComponentName.test.js for unittesting
    "updateIndexScss": true, // Updated the default index.scss with the new component
    "updateIndexJs": true // Updated the index.js with the new component
}
```

## Overriding templates ##

Currently all templates can be overridden, they all exists in internals/templates/cli and interal/templates/server

Most of the templates can be overridden by placing a new file in the root folder, else a better way is to copy all templates and then change the rootServerTemplatePath in .frontendrc file

### Base index override ###

You can override the index.html if you want by adding a index.html in the rootfolder (next to webpack.config.js), and it will use that instead of the built in from server, thou if you change the id from container, you will have to edit the server.js as well.

This can be used for a global addition of classes for examples to wrap the container or similar. 

Ex index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React testing ground</title>
    <script src="${publicPath}js/vendor.js"></script>
    <script src="${publicPath}js/index.js"></script>
    <link rel="stylesheet" href="${publicPath}css/index.css">
</head>
<body>
    <!-- content -->
    <!-- react-render -->
</body>
</html>
```

### Snippet in component ###

You can override the snippet writing out html if you want by adding a html file in your componentfolder, eg: MyComponent.html
The div with the id container is required as that is where the component will be rendered.

```html
<h1>My component extra!</h1>
<div id="${containerId}"><!-- content --></div>
```

### Full component override ###

You can also add a index.html file in your component folder, and that file will be used as template. It will have a global variable placed above </head> tag with the data in the json file.

Example index.html inside MyComponent folder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React testing ground</title>
    <script src="${publicPath}js/vendor.js"></script>
    <script src="${publicPath}js/index.js"></script>
    <link rel="stylesheet" href="${publicPath}css/index.css">
</head>
<body>
    <h1>My component's own index!</h1>
    <div id="${containerId}"></div>
    <script>
    ReactDOM.render(React.createElement(Components.${componentName}, ${data}), document.getElementById("${containerId}"));
    </script>
</body>
</html>
```

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

### Serverside rendering gets errors ###

The serverside rendering is using it's own babel configuration, so you might need to add plugins twice to make it work currently. The configuration is found in internals/server/index.js

#### window is not defined ####

Common problem with serverside rendering, if you are using window on pre componentDidMount, you will need to check if it exists. Preferably thou you will need to set a state in componentDidMount for it to be rendered correctly on the serverside, however just to check if window exists you can write this:

```javascript
if(typeof window !== 'undefined') {
    // do you window things here
}
```

## License
react-sass-starterkit is released under the [MIT License](http://www.opensource.org/licenses/MIT).
