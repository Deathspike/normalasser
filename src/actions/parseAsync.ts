import * as app from '..';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {hasSubtitle} from './utils/hasSubtitle';

export async function parseAsync(paths: Array<string>, options: app.Options) {
  for (const path of paths) {
    await checkAsync(path, options);
  }
}

async function checkAsync(path: string, options: app.Options) {
  const stats = await fs.promises.stat(path).catch(() => {});
  if (!stats) {
    console.log(`Rejected ${path}`);
  } else if (stats.isDirectory()) {
    console.log(`Checking ${path}`);
    await directoryAsync(path, options);
    console.log(`Finished ${path}`);
  } else if (stats.isFile() && path.endsWith('.ass')) {
    console.log(`Fetching ${path}`);
    await traceAsync(path, app.parseAsync(path, options.size));
  } else if (stats.isFile() && path.endsWith('.mkv')) {
    console.log(`Fetching ${path}`);
    await traceAsync(path, app.extractAsync(path, options.size));
  }
}

async function directoryAsync(directoryPath: string, options: app.Options) {
  const childNames = await fs.promises.readdir(directoryPath).catch(() => []);
  const childSet = new Set(childNames);
  for (const childName of childNames) {
    const childPath = path.join(directoryPath, childName);
    const stats = await fs.promises.stat(childPath).catch(() => {});
    if (stats?.isDirectory()) {
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith('.ass')) {
      if (!options.checkAss) continue;
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith('.mkv')) {
      if (!options.forceMkv && hasSubtitle(childName, childSet)) continue;
      await checkAsync(childPath, options);
    }
  }
}

async function traceAsync(filePath: string, resultAsync: Promise<boolean>) {
  try {
    const result = await resultAsync;
    const status = result ? 'OK' : 'Not Found';
    console.log(`Finished ${filePath} (${status})`);
  } catch (err) {
    const status = err instanceof Error ? err.stack : err;
    console.log(`Rejected ${filePath}: ${status}`);
  }
}
