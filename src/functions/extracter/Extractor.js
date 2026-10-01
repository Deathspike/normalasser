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

  /** @param {(fullPath: string) => Promise<void>} processAsync */
  async runAsync(processAsync) {
    try {
      await fs.promises.rm(this.#outputPath, { recursive: true, force: true });
      await fs.promises.mkdir(this.#outputPath, { recursive: true });
      return await this.#execAsync(processAsync);
    } finally {
      await fs.promises.rm(this.#outputPath, { recursive: true, force: true });
    }
  }

  /** @param {(fullPath: string) => Promise<void>} processAsync */
  async #execAsync(processAsync) {
    if (await ffmpegAsync(this.#args)) {
      const newNames = await fs.promises.readdir(this.#outputPath);
      const newPaths = newNames.map((x) => path.join(this.#outputPath, x));
      await Promise.all(newPaths.map((x) => processAsync(x)));
      await this.#moveAsync(newNames);
      return true;
    } else {
      return false;
    }
  }

  /** @param {string[]} newNames */
  async #moveAsync(newNames) {
    for (const newName of newNames) {
      const oldPath = path.join(this.#outputPath, newName);
      const newPath = path.join(this.#basePath, newName);
      await fs.promises.rename(oldPath, newPath);
    }
    for (const oldPath of await existingAsync(this.#baseName, this.#basePath)) {
      const name = path.basename(oldPath);
      if (newNames.includes(name)) continue;
      await fs.promises.rm(oldPath);
    }
  }
}
