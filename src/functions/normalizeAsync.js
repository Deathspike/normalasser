import * as app from "../index.js";
import * as fs from "node:fs";

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
export async function normalizeAsync(fullPath, size) {
  const oldValue = await fs.promises.readFile(fullPath, "utf-8");
  const newValue = app.features.normalizer.normalize(oldValue, size);
  if (newValue !== oldValue) {
    await fs.promises.writeFile(`${fullPath}.tmp`, newValue);
    await fs.promises.rename(`${fullPath}.tmp`, fullPath);
    return true;
  } else {
    return false;
  }
}
