import * as app from "../index.js";
import * as fs from "node:fs";

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
export async function extractAsync(fullPath, size) {
  const builder = new app.features.extracter.ExtractorBuilder(fullPath);
  const extractor = await builder.buildAsync();
  return await extractor.runAsync((x) => processAsync(x, size));
}

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
async function processAsync(fullPath, size) {
  const oldValue = await fs.promises.readFile(fullPath, "utf-8");
  const newValue = app.features.normalizer.normalize(oldValue, size);
  if (newValue !== oldValue) await fs.promises.writeFile(fullPath, newValue);
}
