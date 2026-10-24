import fs from "node:fs";
import path from "node:path";

/**
 * @param {string} baseName
 * @param {string} basePath
 */
export async function existingAsync(baseName, basePath) {
  const names = await fs.promises.readdir(basePath);
  const filePaths = [];
  for (const name of names) {
    if (!name.endsWith(".ass")) continue;
    if (!name.startsWith(`${baseName}.`)) continue;
    filePaths.push(path.join(basePath, name));
  }
  return filePaths;
}
