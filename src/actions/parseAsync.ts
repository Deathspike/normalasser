import * as app from '..';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
    await traceAsync(path, app.parseAsync(path, options));
  } else if (stats.isFile() && path.endsWith('.mkv')) {
    console.log(`Fetching ${path}`);
    await traceAsync(path, app.extractAsync(path, options));
  }
}

async function directoryAsync(directoryPath: string, options: app.Options) {
  const names = await fs.promises.readdir(directoryPath).catch(() => []);
  const paths = new Set(names.map(x => path.join(directoryPath, x)));
  for (const path of paths) {
    const stats = await fs.promises.stat(path).catch(() => {});
    if (stats?.isDirectory()) {
      await checkAsync(path, options);
    } else if (stats?.isFile() && path.endsWith('.ass')) {
      if (!options.checkAss) continue;
      await checkAsync(path, options);
    } else if (stats?.isFile() && path.endsWith('.mkv')) {
      const subtitlePath = app.subtitlePath(path, options);
      if (!options.forceMkv && paths.has(subtitlePath)) continue;
      await checkAsync(path, options);
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
