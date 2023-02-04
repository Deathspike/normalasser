import * as app from '..';
import * as fs from 'node:fs';

export async function parseAsync(filePath: string, options: app.Options) {
  const oldValue = await fs.promises.readFile(filePath, 'utf8');
  const newValue = app.subtitleScale(oldValue, options);
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
