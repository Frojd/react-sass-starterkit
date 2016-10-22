# React sass boilerplate

## Description

Frontend boilerplate for work with react and sass, using webpack as taskrunner and devserver for testing components. It will automatically find new components in the components folder and reload changes.

## Installation

1. Clone the project
2. npm install
3. Create a component: npm run new MyComponentName
4. If you want classbase and scss file: npm run new MyComponentName scss class
5. Start the devserver: npm start

Visit your list of components at: http://localhost:7000

Files will be built to dist folder.

## CLI

npm run new ComponentName class scss

Remove class and/or scss if you only want a basic component.

index.scss and index.js will be automatically updated when adding a component through the cli.
