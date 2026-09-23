import * as path from "node:path";

/**
 * @param {string} fileName
 * @param {Set<string>} fileNames
 */
export function hasSubtitle(fileName, fileNames) {
  const { name } = path.parse(fileName);
  for (const fileName of fileNames) {
    if (!fileName.endsWith(".ass")) continue;
    if (!fileName.startsWith(`${name}.`)) continue;
    return true;
  }
  return false;
}
