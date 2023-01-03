import * as app from '..';

export async function extractAsync(filePath: string, options: app.Options) {
  const languages = await languagesAsync(filePath, options);
  const languageId = languages.get(options.language);
  if (languageId) {
    const args = ['-y', '-i', filePath, '-map', `0:${languageId}`, '-f', 'ass'];
    const tempPath = `${app.subtitlePath(filePath, options)}.tmp`;
    await app.ffmpegAsync(args.concat(tempPath));
    return await app.parseAsync(tempPath, options);
  } else {
    return false;
  }
}

async function languagesAsync(filePath: string, options: app.Options) {
  const value = await app.ffmpegAsync(['-i', filePath]);
  const expression = /Stream #0:([0-9]+)(?:\((.+)\))?: Subtitle: ass/gm;
  const result = new Map<string, string>();
  let match: RegExpMatchArray | null;
  while ((match = expression.exec(value))) {
    const id = match[1] ?? '';
    const language = match[2] ?? options.language;
    if (!result.has(language)) result.set(language, id);
  }
  return result;
}
