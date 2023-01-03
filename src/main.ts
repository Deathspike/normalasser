import * as app from '.';
import * as commander from 'commander';

export function main() {
  return new commander.Command(require('../package').name)
    .description(require('../package').description)
    .version(require('../package').version)
    .addCommand(parse());
}

function parse() {
  const sizeOption = new commander.Option('-s, --size <s>', 'The font size')
    .choices(['tiny', 'small', 'normal', 'large', 'huge'])
    .default('normal');
  return new commander.Command('parse')
    .arguments('<path...>')
    .description('Recursively parse subtitles')
    .option('-l, --language <s>', 'The ISO 639-3 language code', 'eng')
    .addOption(sizeOption)
    .action(app.actions.parseAsync);
}
