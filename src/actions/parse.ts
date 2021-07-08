import * as app from '..';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function parseAsync(this: IOptions, resourcePaths: string[]) {
  for (const resourcePath of resourcePaths) {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      console.log(`Checking ${resourcePath}`);
      await directoryAsync(resourcePath, this);
      console.log(`Finished ${resourcePath}`);
    } else if (stat.isFile()) {
      await fileAsync(resourcePath, this);
    }
  }
}

async function directoryAsync(directoryPath: string, options?: IOptions) {
  const resourceNames = await fs.readdir(directoryPath);
  const resourcePaths = resourceNames.map(x => path.join(directoryPath, x));
  for (const resourcePath of resourcePaths) {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      console.log(`Checking ${resourcePath}`);
      await directoryAsync(resourcePath, options);
      console.log(`Finished ${resourcePath}`);
    } else if (stat.isFile()) {
      await fileAsync(resourcePath, options);
    }
  }
}

async function fileAsync(filePath: string, options?: IOptions) {
  if (/\.(?:ass|mkv)$/.test(filePath)) try {
    console.log(`Fetching ${filePath}`);
    await app.parseFileAsync(filePath, options);
    console.log(`Finished ${filePath}`);
  } catch (error) {
    console.log(`Rejected ${filePath}`);
    console.log(error);
  }
}
