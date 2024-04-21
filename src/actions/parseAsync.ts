import * as app from '..';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {hasSubtitle} from './utils/hasSubtitle';

export async function parseAsync(paths: Array<string>, options?: app.Options) {
  for (const fullPath of paths) {
    await checkAsync(fullPath, options);
  }
}

async function checkAsync(fullPath: string, options?: app.Options) {
  const stats = await fs.promises.stat(fullPath).catch(() => {});
  if (!stats) {
    console.log(`Rejected ${fullPath}`);
  } else if (stats.isDirectory()) {
    console.log(`Checking ${fullPath}`);
    await directoryAsync(fullPath, options);
    console.log(`Finished ${fullPath}`);
  } else if (stats.isFile() && fullPath.endsWith('.ass')) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, app.normalizeAsync(fullPath, options?.size));
  } else if (stats.isFile() && fullPath.endsWith('.mkv')) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, app.extractAsync(fullPath, options?.size));
  }
}

async function directoryAsync(fullPath: string, options?: app.Options) {
  const childNames = await fs.promises.readdir(fullPath).catch(() => []);
  const childSet = new Set(childNames);
  for (const childName of childNames) {
    const childPath = path.join(fullPath, childName);
    const stats = await fs.promises.stat(childPath).catch(() => {});
    if (stats?.isDirectory()) {
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith('.ass')) {
      if (!options?.checkAss) continue;
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith('.mkv')) {
      if (!options?.forceMkv && hasSubtitle(childName, childSet)) continue;
      await checkAsync(childPath, options);
    }
  }
}

async function traceAsync(fullPath: string, resultAsync: Promise<boolean>) {
  try {
    const result = await resultAsync;
    const status = result ? 'Finished' : 'Skipping';
    console.log(`${status} ${fullPath}`);
  } catch (err) {
    const status = err instanceof Error ? err.stack : err;
    console.log(`Rejected ${fullPath}: ${status}`);
  }
}
