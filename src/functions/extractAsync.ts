import * as app from '..';
import * as fs from 'node:fs';
import Size = app.features.normalizer.Size;

export async function extractAsync(fullPath: string, size?: Size) {
  const builder = new app.features.extracter.ExtractorBuilder(fullPath);
  const extractor = await builder.buildAsync();
  return await extractor.runAsync(x => processAsync(x, size));
}

async function processAsync(fullPath: string, size?: Size) {
  const oldValue = await fs.promises.readFile(fullPath, 'utf-8');
  const newValue = app.features.normalizer.normalize(oldValue, size);
  if (newValue !== oldValue) await fs.promises.writeFile(fullPath, newValue);
}
