import fs from "node:fs";
import path from "node:path";
import * as normalasser from "../index.js";
import { Options } from "./Options.js";

/**
 * @param {string[]} paths
 * @param {Options} [options]
 */
export async function parseAsync(paths, options) {
  for (const fullPath of paths) {
    await checkAsync(fullPath, options);
  }
}

/**
 * @param {string} fullPath
 * @param {Options} [options]
 */
async function checkAsync(fullPath, options) {
  const size = options?.size;
  const stats = await fs.promises.stat(fullPath).catch(() => {});
  if (!stats) {
    console.log(`Rejected ${fullPath}`);
  } else if (stats.isDirectory()) {
    console.log(`Checking ${fullPath}`);
    await directoryAsync(fullPath, options);
    console.log(`Finished ${fullPath}`);
  } else if (stats.isFile() && fullPath.endsWith(".ass")) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, normalasser.normalizeAsync(fullPath, size));
  } else if (stats.isFile() && fullPath.endsWith(".mkv")) {
    console.log(`Fetching ${fullPath}`);
    await traceAsync(fullPath, normalasser.extractAsync(fullPath, size));
  }
}

/**
 * @param {string} fullPath
 * @param {Options} [options]
 */
async function directoryAsync(fullPath, options) {
  const childNames = await fs.promises.readdir(fullPath).catch(() => []);
  for (const childName of childNames) {
    const childPath = path.join(fullPath, childName);
    const stats = await fs.promises.stat(childPath).catch(() => {});
    if (stats?.isDirectory()) {
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith(".ass")) {
      if (!options?.checkAss) continue;
      await checkAsync(childPath, options);
    } else if (stats?.isFile() && childName.endsWith(".mkv")) {
      if (!options?.forceMkv && hasSubtitle(childName, childNames)) continue;
      await checkAsync(childPath, options);
    }
  }
}

/**
 * @param {string} videoName
 * @param {string[]} otherNames
 */
export function hasSubtitle(videoName, otherNames) {
  const { name } = path.parse(videoName);
  return otherNames.some((otherName) => {
    const isSubtitle = otherName.endsWith(".ass");
    const matchesVideoName = otherName.startsWith(`${name}.`);
    return isSubtitle && matchesVideoName;
  });
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
