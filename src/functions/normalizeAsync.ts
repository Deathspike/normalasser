import * as app from '..';
import * as fs from 'node:fs';
import Size = app.features.normalizer.Size;

export async function normalizeAsync(filePath: string, size: Size) {
  const oldValue = await fs.promises.readFile(filePath, 'utf8');
  const newValue = app.features.normalizer.normalize(oldValue, size);
  if (newValue !== oldValue) {
    await fs.promises.writeFile(`${filePath}.tmp`, newValue);
    await fs.promises.rename(`${filePath}.tmp`, filePath);
    return true;
  } else {
    return false;
  }
}
