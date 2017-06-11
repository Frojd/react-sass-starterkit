/**
 * CLI for scaffolding new components
 */

const internalCli = require('../internals/cli');

const cli = (args) => {
    let command = args[2];
    switch(command) {
    case 'new':
        if(args[3]) {
            return internalCli.createNewComponent(args[3]);
        }
        console.error('Need a componentname when creating a new component');
        break;
    case 'delete':
        if(args[3]) {
            return internalCli.deleteComponent(args[3]);
        }
        console.error('Need a componentname when deleteing a new component');
        break;
    case 'publish':
        if(args[3]) {
            return internalCli.publishComponent(args[4], args[5]);
        }
        console.error('Need a componentname when publishing a component');
        break;
    case 'publishAll':
        internalCli.publishAllComponents();
        break;
    case 'publishSnippet':
        if(args[3]) {
            return internalCli.createComponentFiles(args[3]);
        }
        console.error('Need a componentname when publishing a component');
        break;
    default:
        console.warn('Not a valid argument');
    }
}

cli(process.argv);
