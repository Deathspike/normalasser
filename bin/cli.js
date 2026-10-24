#!/usr/bin/env node
import path from "node:path";

import { Options } from "../src/actions/Options.js";
import { parseAsync } from "../src/actions/parseAsync.js";
import { serverAsync } from "../src/actions/serverAsync.js";

const args = process.argv.slice(2);
const fullPaths = [];
const options = new Options();
let port;

for (let index = 0; index < args.length; index++) {
  const parameter = args[index] || "";
  switch (parameter) {
    case "--check-ass":
      options.checkAss = true;
      break;
    case "--force-mkv":
      options.forceMkv = true;
      break;
    case "--port":
      port = Number(args[++index]) || 0;
      break;
    case "--size":
      options.size = Number(args[++index]) || undefined;
      break;
    default:
      if (!path.isAbsolute(parameter)) break;
      fullPaths.push(parameter);
      break;
  }
}

if (fullPaths.length) {
  await parseAsync(fullPaths, options);
} else {
  await serverAsync(options, port);
}
