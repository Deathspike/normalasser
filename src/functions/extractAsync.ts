import * as app from '..';
import * as fs from 'node:fs';

export async function extractAsync(filePath: string, options: app.Options) {
  const languages = await languagesAsync(filePath, options);
  const languageId = languages.get(options.language);
  if (languageId) {
    const args = ['-y', '-i', filePath, '-map', `0:${languageId}`, '-f', 'ass'];
    const tempPath = `${app.subtitlePath(filePath, options)}.tmp`;
    await app.ffmpegAsync(args.concat(tempPath));
    await waitForFileFlushAsync(tempPath);
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

async function waitForFileFlushAsync(filePath: string) {
  let oldSize = -1;
  for (let i = 0; i < 10; i++) {
    const newSize = await fs.promises
      .stat(filePath)
      .then(x => x.size)
      .catch(() => 0);
    if (!newSize || oldSize !== newSize) {
      oldSize = newSize;
      await new Promise(x => setTimeout(x, 1000));
    } else {
      break;
    }
  }
}
