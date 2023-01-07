import * as app from '..';
import * as ass from 'ass-compiler';
import * as fs from 'node:fs';

export async function parseAsync(filePath: string, options: app.Options) {
  const oldValue = await fs.promises.readFile(filePath, 'utf8');
  const newValue = run(oldValue, options);
  if (newValue === oldValue) {
    return false;
  } else if (filePath.endsWith('.tmp')) {
    await fs.promises.writeFile(filePath, newValue);
    await fs.promises.rename(filePath, filePath.replace(/\.[^\.]+$/, ''));
    return true;
  } else {
    await fs.promises.writeFile(`${filePath}.tmp`, newValue);
    await fs.promises.rename(`${filePath}.tmp`, filePath);
    return true;
  }
}

function run(value: string, options: app.Options) {
  const subtitle = ass.parse(value);
  app.subtitleScale(subtitle, options);
  return ass.stringify(subtitle);
}
