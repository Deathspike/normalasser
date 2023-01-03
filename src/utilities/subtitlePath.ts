import * as app from '..';
import * as path from 'node:path';

export function subtitlePath(filePath: string, options: app.Options) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const subtitleName = `${baseName}.${options.language}.ass`;
  return path.join(path.dirname(filePath), subtitleName);
}
