import * as fs from "node:fs";
import * as path from "node:path";

/**
 * @param {string} baseName
 * @param {string} basePath
 */
export async function existingAsync(baseName, basePath) {
  const fullNames = await fs.promises.readdir(basePath);
  const fullPaths = [];
  for (const fullName of fullNames) {
    if (!fullName.endsWith(".ass")) continue;
    if (!fullName.startsWith(`${baseName}.`)) continue;
    fullPaths.push(path.join(basePath, fullName));
  }
  return fullPaths;
}
