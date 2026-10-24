import fs from "node:fs";

import { ExtractorBuilder } from "./extracter/ExtractorBuilder.js";
import { normalize } from "./normalizer/normalize.js";

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
export async function extractAsync(fullPath, size) {
  const builder = new ExtractorBuilder(fullPath);
  const extractor = await builder.buildAsync();
  return await extractor.runAsync((fullPath) => processAsync(fullPath, size));
}

/**
 * @param {string} fullPath
 * @param {number} [size]
 */
async function processAsync(fullPath, size) {
  const oldValue = await fs.promises.readFile(fullPath, "utf8");
  const newValue = normalize(oldValue, size);
  if (newValue !== oldValue) await fs.promises.writeFile(fullPath, newValue);
}
