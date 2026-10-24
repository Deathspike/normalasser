import fs from "node:fs";

import { ExtractorBuilder } from "./extracter/ExtractorBuilder.js";
import { normalize } from "./normalizer/normalize.js";

/**
 * @param {string} filePath
 * @param {number} [size]
 */
export async function extractAsync(filePath, size) {
  const builder = new ExtractorBuilder(filePath);
  const extractor = await builder.buildAsync();
  return await extractor.runAsync((filePath) => processAsync(filePath, size));
}

/**
 * @param {string} filePath
 * @param {number} [size]
 */
async function processAsync(filePath, size) {
  const oldValue = await fs.promises.readFile(filePath, "utf8");
  const newValue = normalize(oldValue, size);
  if (newValue !== oldValue) await fs.promises.writeFile(filePath, newValue);
}
