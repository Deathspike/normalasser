import * as app from '..';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function parseDirectoryAsync(dirPath: string, options?: IOptions) {
  const resourceNames = await fs.readdir(dirPath);
  const resourcePaths = resourceNames.map(x => path.join(dirPath, x));
  for (const resourcePath of resourcePaths) {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      await app.parseDirectoryAsync(resourcePath, options);
    } else {
      await app.parseFileAsync(resourcePath, options);
    }
  }
}
