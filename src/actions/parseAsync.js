import fs from "node:fs";
import path from "node:path";

import * as normalasser from "../index.js";
import { Options } from "./Options.js";

/**
 * @param {string[]} paths
 * @param {Options} [options]
 */
export async function parseAsync(paths, options) {
  for (const path of paths) {
    await checkAsync(path, options);
  }
}

/**
 * @param {string} path
 * @param {Options} [options]
 */
async function checkAsync(path, options) {
  const stats = await fs.promises.stat(path).catch(() => {});
  if (!stats) {
    console.log(`Rejected ${path}`);
  } else if (stats.isDirectory()) {
    console.log(`Checking ${path}`);
    await directoryAsync(path, options);
    console.log(`Finished ${path}`);
  } else if (stats.isFile() && path.endsWith(".ass")) {
    console.log(`Fetching ${path}`);
    await traceAsync(path, normalasser.normalizeAsync(path, options?.size));
  } else if (stats.isFile() && path.endsWith(".mkv")) {
    console.log(`Fetching ${path}`);
    await traceAsync(path, normalasser.extractAsync(path, options?.size));
  }
}

/**
 * @param {string} directoryPath
 * @param {Options} [options]
 */
async function directoryAsync(directoryPath, options) {
  const childNames = await fs.promises.readdir(directoryPath).catch(() => []);
  for (const childName of childNames) {
    const childPath = path.join(directoryPath, childName);
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
function hasSubtitle(videoName, otherNames) {
  const { name } = path.parse(videoName);
  return otherNames.some((otherName) => {
    const isSubtitle = otherName.endsWith(".ass");
    const matchesVideoName = otherName.startsWith(`${name}.`);
    return isSubtitle && matchesVideoName;
  });
}

/**
 * @param {string} filePath
 * @param {Promise<boolean>} resultAsync
 */
async function traceAsync(filePath, resultAsync) {
  try {
    const result = await resultAsync;
    const status = result ? "Finished" : "Skipping";
    console.log(`${status} ${filePath}`);
  } catch (err) {
    const stack = err instanceof Error ? err.stack : undefined;
    const status = stack ?? String(err);
    console.log(`Rejected ${filePath}: ${status}`);
  }
}
