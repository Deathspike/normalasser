import fs from "node:fs";

import { normalize } from "./normalizer/normalize.js";

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
export async function normalizeAsync(fullPath, size) {
  const oldValue = await fs.promises.readFile(fullPath, "utf8");
  const newValue = normalize(oldValue, size);
  if (newValue === oldValue) {
    return false;
  } else {
    await fs.promises.writeFile(`${fullPath}.tmp`, newValue);
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
    return true;
  }
}
