import * as app from '..';
import * as path from 'path';

export async function parseFileAsync(filePath: string, options?: IOptions) {
  try {
    if (filePath.endsWith('.ass')) {
      console.log(`Fetching ${filePath}`);
      await app.parseSubAsync(filePath, options);
      console.log(`Finished ${filePath}`);
    } else if (filePath.endsWith('.mkv')) {
      console.log(`Fetching ${filePath}`);
      await extractSubtitles(filePath, options);
      console.log(`Finished ${filePath}`);
    }
  } catch (error) {
    console.log(`Rejected ${filePath}`);
    console.log(error);
  }
}

async function extractSubtitles(filePath: string, options?: IOptions) {
  const expression = /Stream #0:([0-9]+)\(([a-z]{3})\): Subtitle: ass/gm;
  const result = await app.ffmpegAsync(['-i', filePath]);
  let match: RegExpMatchArray | null;
  while (match = expression.exec(result)) {
    const id = match[1];
    const language = match[2];
    if (!options || !options.language || options.language === language) {
      const subtitlePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.${language}.ass`);
      await app.ffmpegAsync(['-y', '-i', filePath, '-map', `0:${id}`, subtitlePath]);
      await app.parseSubAsync(subtitlePath, options);
    }
  }
}
