/**
 * CLI for scaffolding new components
 */

const path = require('path');
const program = require('commander');
const Cli = require('../internals/cli/cli.js');

program
    .command('new <component> [subComponent...]')
    .description('Creates a new component')
    .option('-c, --class', 'Create class component')
    .option('-p, --pure', 'Create pure component')
    .option('-s, --scss', 'Create scss file')
    .option('-t, --test', 'Create test.js file')
    .option('-d, --data', 'Create data json file')
    .option('-i, --index', 'Create index.js file')
    .option('-C, --componentsFolder <cFolder>', 'Change components folder')
    .option('-I, --append-index', 'Append to index.js')
    .option('-S, --append-scss', 'Append to index.scss')
    .action((component, subComponents, options) => {
        let overrides = {}
        if(options.class) {overrides.createClass = false;}
        if(options.pure) {overrides.createPure = true;}
        if(options.scss) {overrides.createScss = false;}
        if(options.test) {overrides.createTest = false;}
        if(options.index) {overrides.createIndex = false;}
        if(options.appendIndex) {overrides.updateIndexJs = false;}
        if(options.appendScss) {overrides.updateIndexScss = false;}
        if(options.componentsFolder) {overrides.componentsFolder = options.componentsFolder}
        
        if(subComponents.length) {
            overrides.updateIndexScss = false;
            overrides.updateIndexJs = false;
        }
        
        const config = require('../internals/config.js')(overrides);
        const rootFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        const cli = new Cli(config);
        if(!cli.validatePath(componentPath)) {
            throw new Error(`Component already exists at: ${componentPath}`);
        }
        
        cli.createComponent(componentPath, paths[paths.length-1]);
    });

program.command('delete <componentName> [subComponent...]')
    .option('-C, --componentsFolder <cFolder>', 'Change components folder')
    .action((component, subComponents, options) => {
        let overrides = {}
        if(options.componentsFolder) {overrides.componentsFolder = options.componentsFolder}

        const config = require('../internals/config.js')(overrides);
        const rootFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        const cli = new Cli(config);
        if(cli.validatePath(componentPath)) {
            throw new Error(`Component doesn't exist at: ${componentPath}`);
        }
        
        cli.deleteComponent(componentPath, paths[paths.length-1]);
    });

program.parse(process.argv);

// const internalCli = require('../internals/cli');

// const cli = (args) => {
//     let command = args[2];
//     switch(command) {
//     case 'new':
//         if(args[3]) {
//             return internalCli.createNewComponent(args[3]);
//         }
//         console.error('Need a componentname when creating a new component');
//         break;
//     case 'delete':
//         if(args[3]) {
//             return internalCli.deleteComponent(args[3]);
//         }
//         console.error('Need a componentname when deleteing a new component');
//         break;
//     case 'publish':
//         if(args[3]) {
//             return internalCli.publishComponent(args[4], args[5]);
//         }
//         console.error('Need a componentname when publishing a component');
//         break;
//     case 'publishAll':
//         internalCli.publishAllComponents();
//         break;
//     case 'publishSnippet':
//         if(args[3]) {
//             return internalCli.createComponentFiles(args[3]);
//         }
//         console.error('Need a componentname when publishing a component');
//         break;
//     default:
//         console.warn('Not a valid argument');
//     }
// }

// cli(process.argv);
