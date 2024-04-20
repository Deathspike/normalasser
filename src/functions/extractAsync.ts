import * as app from '..';
import Size = app.features.normalizer.Size;

export async function extractAsync(fullPath: string, size: Size) {
  const builder = new app.features.extracter.ExtractorBuilder(fullPath);
  const extractor = await builder.buildAsync();
  const subtitlePaths = await extractor.runAsync();
  if (subtitlePaths) {
    await Promise.all(subtitlePaths.map(x => app.normalizeAsync(x, size)));
    return true;
  } else {
    return false;
  }
}
