import * as app from '.';
import * as commander from 'commander';

export function main() {
  return new commander.Command(require('../package').name)
    .description(require('../package').description)
    .version(require('../package').version)
    .addCommand(commandParse())
    .addCommand(commandServer());
}

function commandParse() {
  return new commander.Command('parse')
    .arguments('<path...>')
    .description('Parse subtitles')
    .option('--check-ass', 'Determines whether to check .ass files')
    .option('--force-mkv', 'Determines whether to force .mkv files')
    .addOption(optionSize())
    .action(app.actions.parseAsync);
}

function commandServer() {
  return new commander.Command('server')
    .description('Listen for HTTP events')
    .option('--check-ass', 'Determines whether to check .ass files')
    .addOption(optionSize())
    .action(app.actions.serverAsync);
}

function optionSize() {
  return new commander.Option('--size <s>', 'The font size')
    .choices(['tiny', 'small', 'normal', 'large', 'huge'])
    .default('normal');
}
