#!/usr/bin/env node
import { Options } from "../src/actions/Options.js";
import { parseAsync } from "../src/actions/parseAsync.js";

const args = process.argv.slice(2);
const options = new Options();
const paths = [];

for (let index = 0; index < args.length; index++) {
  const parameter = args[index] || "";

  switch (parameter) {
    case "--check-ass":
      options.checkAss = true;
      break;
    case "--force-mkv":
      options.forceMkv = true;
      break;
    case "--size":
      options.size = Number(args[++index]) || undefined;
      break;
    default:
      paths.push(parameter);
      break;
  }
}

if (paths.length) {
  await parseAsync(paths, options);
} else {
  const descriptors = "[--check-ass] [--force-mkv] [--size <number>]";
  console.log(`Usage: normalasser ${descriptors} <paths...>`);
  process.exit(1);
}
