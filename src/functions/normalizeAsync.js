import fs from "node:fs";

import { normalize } from "./normalizer/normalize.js";

/**
 * @param {string} filePath
 * @param {number} [size]
 */
export async function normalizeAsync(filePath, size) {
  const oldValue = await fs.promises.readFile(filePath, "utf8");
  const newValue = normalize(oldValue, size);
  if (newValue === oldValue) {
    return false;
  } else {
    await fs.promises.writeFile(`${filePath}.tmp`, newValue);
    await fs.promises.rename(`${filePath}.tmp`, filePath);
    return true;
  }
}
