import * as app from '..';

export async function extractAsync(fullPath: string, size: app.Size) {
  const builder = new app.features.extractor.ExtractorBuilder(fullPath);
  const extractor = await builder.buildAsync();
  const subtitlePaths = await extractor.runAsync();
  if (subtitlePaths) {
    await Promise.all(subtitlePaths.map(x => app.parseAsync(x, size)));
    return true;
  } else {
    return false;
  }
}
