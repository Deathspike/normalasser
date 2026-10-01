#!/usr/bin/env node
import path from "node:path";
import { Options } from "../src/actions/Options.js";
import { parseAsync } from "../src/actions/parseAsync.js";
import { serverAsync } from "../src/actions/serverAsync.js";

const args = process.argv.slice(2);
const fullPaths = [];
const options = new Options();

for (let index = 0; index < args.length; index++) {
  const parameter = args[index];
  if (!parameter) {
    continue;
  } else if (path.isAbsolute(parameter)) {
    fullPaths.push(parameter);
  } else if (parameter === "--check-ass") {
    options.checkAss = true;
  } else if (parameter === "--force-mkv") {
    options.forceMkv = true;
  } else if (parameter === "--size") {
    options.size = Number.parseFloat(args[index + 1] ?? "0") || undefined;
    index++;
  }
}

if (fullPaths.length) {
  await parseAsync(fullPaths, options);
} else {
  await serverAsync(options);
}
