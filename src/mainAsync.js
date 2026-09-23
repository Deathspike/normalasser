import * as app from "./index.js";
import * as path from "node:path";

export async function mainAsync() {
  /** @type {string[]} */
  const fullPaths = [];
  const options = new app.Options();
  fill(fullPaths, options);
  return fullPaths.length
    ? await app.actions.parseAsync(fullPaths, options)
    : await app.actions.serverAsync(options);
}

/**
 * @param {string[]} fullPaths
 * @param {app.Options} options
 */
function fill(fullPaths, options) {
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg) {
      continue;
    } else if (path.isAbsolute(arg)) {
      fullPaths.push(arg);
    } else if (arg === "--check-ass") {
      options.checkAss = true;
    } else if (arg === "--force-mkv") {
      options.forceMkv = true;
    } else if (arg === "--size") {
      options.size = parseSize(process.argv[i + 1]);
      i++;
    }
  }
}

/** @param {string} [size] */
function parseSize(size) {
  switch (size) {
    case "tiny":
      return 8;
    case "small":
      return 12;
    case "large":
      return 20;
    case "huge":
      return 24;
    default:
      return undefined;
  }
}
