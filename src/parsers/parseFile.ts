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
  const wantedLanguage = options?.language ?? 'eng';
  if (languages[wantedLanguage]) {
    const subtitlePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.${wantedLanguage}.ass`);
    await app.ffmpegAsync(['-y', '-i', filePath, '-map', `0:${languages[wantedLanguage]}`, subtitlePath]);
    await app.parseSubtitleAsync(subtitlePath, options);
  }
}

async function fetchLanguages(filePath: string, options?: IOptions) {
  const data = await app.ffmpegAsync(['-i', filePath]);
  const expression = /Stream #0:([0-9]+)(?:\((.+)\))?: Subtitle: ass/gm;    
  const result: Record<string, string> = {};
  let match: RegExpMatchArray | null;
  while (match = expression.exec(data)) {
    const id = match[1];
    const language = match[2] ?? options?.language ?? 'eng';
    if (!result[language]) result[language] = id;
  }
  return result;
}
