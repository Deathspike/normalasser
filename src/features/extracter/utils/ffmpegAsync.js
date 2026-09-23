import * as childProcess from "node:child_process";

/**
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
export async function ffmpegAsync(args) {
  let isSuccess = false;
  return new Promise((resolve) => {
    const handler = onData.bind(() => (isSuccess = true));
    const process = childProcess.spawn("ffmpeg", args);
    process.stdout.on("data", handler);
    process.stderr.on("data", handler);
    process.on("error", () => {});
    process.on("exit", () => resolve(isSuccess));
  });
}

/**
 * @this {() => void}
 * @param {Buffer} buffer
 */
function onData(buffer) {
  for (const message of buffer.toString().split("\n")) {
    if (!/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/.test(message)) continue;
    this();
  }
}
