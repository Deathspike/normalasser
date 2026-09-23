import * as app from "../index.js";
import * as childProcess from "node:child_process";

/** @param {string} fullPath */
export async function ffprobeAsync(fullPath) {
  const args = ["-v", "quiet", "-print_format", "json", "-show_streams"];
  const result = await spawnAsync("ffprobe", args.concat(fullPath));
  const text = Buffer.concat(result).toString("utf-8");
  return new app.Metadata(JSON.parse(text));
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<Uint8Array<ArrayBufferLike>[]>}
 */
async function spawnAsync(command, args) {
  return await new Promise((resolve, reject) => {
    /** @type {Uint8Array<ArrayBufferLike>[]} */
    const result = [];
    const process = childProcess.spawn(command, args);
    process.stdout.on("data", (x) => result.push(x));
    process.stderr.on("data", (x) => result.push(x));
    process.on("error", (x) => reject(x));
    process.on("exit", () => resolve(result));
  });
}
