import fs from "node:fs";
import path from "node:path";

import { existingAsync } from "./utils/existingAsync.js";
import { ffmpegAsync } from "./utils/ffmpegAsync.js";

export class Extractor {
  /** @readonly @type {Array<string>} */
  #args;
  /** @readonly @type {string} */
  #baseName;
  /** @readonly @type {string} */
  #basePath;
  /** @readonly @type {string} */
  #outputPath;

  /**
   * @param {string[]} args
   * @param {string} baseName
   * @param {string} basePath
   * @param {string} outputPath
   */
  constructor(args, baseName, basePath, outputPath) {
    this.#args = args;
    this.#baseName = baseName;
    this.#basePath = basePath;
    this.#outputPath = outputPath;
  }

  /** @param {(filePath: string) => Promise<void>} processAsync */
  async runAsync(processAsync) {
    try {
      await fs.promises.rm(this.#outputPath, { force: true, recursive: true });
      await fs.promises.mkdir(this.#outputPath, { recursive: true });
      return await this.#execAsync(processAsync);
    } finally {
      await fs.promises.rm(this.#outputPath, { force: true, recursive: true });
    }
  }

  /** @param {(filePath: string) => Promise<void>} processAsync */
  async #execAsync(processAsync) {
    if (await ffmpegAsync(this.#args)) {
      const names = await fs.promises.readdir(this.#outputPath);
      const filePaths = names.map((name) => path.join(this.#outputPath, name));
      await Promise.all(filePaths.map((filePath) => processAsync(filePath)));
      await this.#moveAsync(names);
      return true;
    } else {
      return false;
    }
  }

  /** @param {string[]} names */
  async #moveAsync(names) {
    for (const name of names) {
      const oldPath = path.join(this.#outputPath, name);
      const newPath = path.join(this.#basePath, name);
      await fs.promises.rename(oldPath, newPath);
    }
    for (const oldPath of await existingAsync(this.#baseName, this.#basePath)) {
      const name = path.basename(oldPath);
      if (names.includes(name)) continue;
      await fs.promises.rm(oldPath);
    }
  }
}
