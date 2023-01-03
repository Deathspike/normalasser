import * as app from '..';
import * as fs from 'node:fs';
import * as path from 'node:path';

export async function parseAsync(paths: Array<string>, options: app.Options) {
  for (const path of paths) {
    await checkAsync(path, options);
  }
}

async function checkAsync(resourcePath: string, options: app.Options) {
  const resourceStat = await fs.promises.stat(resourcePath).catch(() => {});
  if (resourceStat?.isDirectory()) {
    console.log(`Checking ${resourcePath}`);
    await directoryAsync(resourcePath, options);
    console.log(`Finished ${resourcePath}`);
  } else if (resourceStat?.isFile() && resourcePath.endsWith('.ass')) {
    console.log(`Fetching ${resourcePath}`);
    await traceAsync(resourcePath, app.parseAsync(resourcePath, options));
  } else if (resourceStat?.isFile() && resourcePath.endsWith('.mkv')) {
    console.log(`Fetching ${resourcePath}`);
    await traceAsync(resourcePath, app.extractAsync(resourcePath, options));
  }
}

async function directoryAsync(directoryPath: string, options: app.Options) {
  const childNames = await fs.promises.readdir(directoryPath).catch(() => []);
  const childPaths = new Set(childNames.map(x => path.join(directoryPath, x)));
  for (const childPath of childPaths) {
    if (childPaths.has(app.subtitlePath(childPath, options))) continue;
    await checkAsync(childPath, options);
  }
}

async function traceAsync(resourcePath: string, resultAsync: Promise<boolean>) {
  const result = await resultAsync.catch(() => false);
  const status = result ? 'Finished' : 'Skipping';
  console.log(`${status} ${resourcePath}`);
}
