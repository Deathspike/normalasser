import * as app from '..';
import * as fs from 'node:fs';

export async function parseAsync(filePath: string, size: app.Size) {
  const oldValue = await fs.promises.readFile(filePath, 'utf8');
  const newValue = app.subtitleScale(oldValue, size);
  if (newValue !== oldValue) {
    await fs.promises.writeFile(`${filePath}.tmp`, newValue);
    await fs.promises.rename(`${filePath}.tmp`, filePath);
    return true;
  } else {
    return false;
  }
}
