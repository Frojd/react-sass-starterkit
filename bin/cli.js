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
    default:
        console.warn('Not a valid argument');
    }
}

cli(process.argv);
