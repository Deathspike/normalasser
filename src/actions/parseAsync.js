import * as app from "../index.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { hasSubtitle } from "./utils/hasSubtitle.js";

/**
 * @param {string[]} paths
 * @param {app.Options} [options]
 */
export async function parseAsync(paths, options) {
  for (const fullPath of paths) {
    await checkAsync(fullPath, options);
  }
}

/**
 * @param {string} fullPath
 * @param {app.Options} [options]
 */
async function checkAsync(fullPath, options) {
  const stats = await fs.promises.stat(fullPath).catch(() => {});
  if (!stats) {
    console.log(`Rejected ${fullPath}`);
  } else if (stats.isDirectory()) {
    console.log(`Checking ${fullPath}`);
    await directoryAsync(fullPath, options);
    console.log(`Finished ${fullPath}`);
  } else if (stats.isFile() && fullPath.endsWith(".ass")) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, app.normalizeAsync(fullPath, options?.size));
  } else if (stats.isFile() && fullPath.endsWith(".mkv")) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, app.extractAsync(fullPath, options?.size));
  }
}

/**
 * @param {string} fullPath
 * @param {app.Options} [options]
 */
async function directoryAsync(fullPath, options) {
  const childNames = await fs.promises.readdir(fullPath).catch(() => []);
  const childSet = new Set(childNames);
  for (const childName of childNames) {
    const childPath = path.join(fullPath, childName);
    const stats = await fs.promises.stat(childPath).catch(() => {});
    if (stats?.isDirectory()) {
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith(".ass")) {
      if (!options?.checkAss) continue;
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith(".mkv")) {
      if (!options?.forceMkv && hasSubtitle(childName, childSet)) continue;
      await checkAsync(childPath, options);
    }
  }
}

/**
 * @param {string} fullPath
 * @param {Promise<boolean>} resultAsync
 */
async function traceAsync(fullPath, resultAsync) {
  try {
    const result = await resultAsync;
    const status = result ? "Finished" : "Skipping";
    console.log(`${status} ${fullPath}`);
  } catch (err) {
    const status = err instanceof Error ? err.stack : err;
    console.log(`Rejected ${fullPath}: ${status}`);
  }
}
