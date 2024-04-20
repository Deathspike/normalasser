import * as app from '.';
import * as path from 'node:path';

export async function mainAsync() {
  const fullPaths: Array<string> = [];
  const options: app.Options = {};
  fill(fullPaths, options);
  return fullPaths.length
    ? await app.actions.parseAsync(fullPaths, options)
    : await app.actions.serverAsync(options);
}

function fill(fullPaths: Array<string>, options: app.Options) {
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg) {
      continue;
    } else if (path.isAbsolute(arg)) {
      fullPaths.push(arg);
    } else if (arg === '--check-ass') {
      options.checkAss = true;
    } else if (arg === '--force-mkv') {
      options.forceMkv = true;
    } else if (arg === '--size') {
      const size = process.argv[i + 1];
      if (size && validate(size)) options.size = size;
      i++;
    }
  }
}

function validate(size: string): size is app.features.normalizer.Size {
  const choices = ['tiny', 'small', 'normal', 'large', 'huge'];
  return choices.includes(size);
}
