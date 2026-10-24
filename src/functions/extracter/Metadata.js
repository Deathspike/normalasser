import childProcess from "node:child_process";

import { MetadataStream } from "./MetadataStream.js";

export class Metadata {
  /** @readonly @type {MetadataStream[] | undefined} */
  streams;

  /** @param {Partial<Metadata>} metadata */
  constructor(metadata) {
    this.streams = metadata.streams?.map(
      (stream) => new MetadataStream(stream),
    );
  }

  /** @param {string} filePath */
  static async ffprobeAsync(filePath) {
    const args = ["-v", "quiet", "-print_format", "json", "-show_streams"];
    const result = await spawnAsync("ffprobe", args.concat(filePath));
    const text = result.toString("utf8");
    return new Metadata(JSON.parse(text));
  }
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<Buffer>}
 */
async function spawnAsync(command, args) {
  return await new Promise((resolve, reject) => {
    /** @type {Uint8Array<ArrayBufferLike>[]} */
    const result = [];
    const process = childProcess.spawn(command, args);
    process.stdout.on("data", (chunk) => result.push(chunk));
    process.stderr.on("data", (chunk) => result.push(chunk));
    process.on("error", (error) => reject(error));
    process.on("exit", () => resolve(Buffer.concat(result)));
  });
}
