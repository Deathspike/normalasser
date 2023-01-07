import * as app from '..';

export function subtitlePath(filePath: string, options: app.Options) {
  return `${filePath.replace(/\.[^\.]+$/, '')}.${options.language}.ass`;
}
