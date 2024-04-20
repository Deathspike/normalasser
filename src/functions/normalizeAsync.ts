import * as app from '..';
import * as fs from 'node:fs';
import Size = app.features.normalizer.Size;

export async function normalizeAsync(fullPath: string, size?: Size) {
  const oldValue = await fs.promises.readFile(fullPath, 'utf-8');
  const newValue = app.features.normalizer.normalize(oldValue, size);
  if (newValue !== oldValue) {
    await fs.promises.writeFile(`${fullPath}.tmp`, newValue);
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
    return true;
  } else {
    return false;
  }
}
