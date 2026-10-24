#!/usr/bin/env node
import { Options } from "../src/actions/Options.js";
import { serverAsync } from "../src/actions/serverAsync.js";

const options = new Options();
const portArgument = process.env["PORT"];
const port = portArgument ? Number.parseInt(portArgument) || 0 : undefined;

options.checkAss = /true/i.test(process.env["CHECK_ASS"] ?? "");
options.forceMkv = /true/i.test(process.env["FORCE_MKV"] ?? "");
options.size = Number(process.env["SIZE"]) || undefined;

await serverAsync(options, port);
