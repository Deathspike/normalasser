import * as app from '..';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function parseDirectoryAsync(directoryPath: string, options?: IOptions) {
  const resourceNames = await fs.readdir(directoryPath);
  const resourcePaths = resourceNames.map(x => path.join(directoryPath, x));
  for (const resourcePath of resourcePaths) {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      await app.parseDirectoryAsync(resourcePath, options);
    } else if (stat.isFile()) {
      await app.parseFileAsync(resourcePath, options);
    }
  }
}
