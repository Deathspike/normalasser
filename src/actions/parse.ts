import * as app from '..';
import * as fs from 'fs-extra';

export async function parseAsync(this: IOptions, resourcePaths: string[]) {
  for (const resourcePath of resourcePaths) {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      await app.parseDirectoryAsync(resourcePath, this);
    } else if (stat.isFile()) {
      await app.parseFileAsync(resourcePath, this);
    }
  }
}
