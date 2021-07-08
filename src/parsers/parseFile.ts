import * as app from '..';
import * as path from 'path';

export async function parseFileAsync(filePath: string, options?: IOptions) {
  if (filePath.endsWith('.ass')) {
    await app.parseSubtitleAsync(filePath, options);
  } else if (filePath.endsWith('.mkv')) {
    await extractSubtitles(filePath, options);
  }
}

async function extractSubtitles(filePath: string, options?: IOptions) {
  const languages = await fetchLanguages(filePath, options);
  const subtitle = (options?.language && languages[options?.language]) ?? languages['eng'];
  if (subtitle) {
    const subtitlePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.${subtitle[2]}.ass`);
    await app.ffmpegAsync(['-y', '-i', filePath, '-map', `0:${subtitle[1]}`, subtitlePath]);
    await app.parseSubtitleAsync(subtitlePath, options);
  }
}

async function fetchLanguages(filePath: string, options?: IOptions) {
  const data = await app.ffmpegAsync(['-i', filePath])
  const expression = /Stream #0:([0-9]+)(?:\(([a-z]{3})\))?: Subtitle: ass/gm;
  const result: Record<string, RegExpMatchArray> = {};
  let match: RegExpMatchArray | null;
  while (match = expression.exec(data)) result[match[2] ?? options?.language ?? 'eng'] = match;
  return result;
}
