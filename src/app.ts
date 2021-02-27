import * as app from '.';
import commander from 'commander';

commander.createCommand()
  .description(require('../package').description)
  .name(require('../package').name)
  .version(require('../package').version)
  .addCommand(commander.createCommand('parse')
    .arguments('<resourcePath...>')
    .description('Parse subtitle(s).')
    .option('-l, --language <s>', 'Set MKV extract language.')
    .option('-s, --size <s>', 'Set font size (tiny, small, normal, large or huge).')
    .action(app.actions.parseAsync))
  .parse();
