import * as fs from 'node:fs';
import * as path from 'node:path';
import {existingAsync} from './utils/existingAsync';
import {ffmpegAsync} from './utils/ffmpegAsync';
import {waitAsync} from './utils/waitAsync';

export class Extractor {
  constructor(
    private readonly args: Array<string>,
    private readonly baseName: string,
    private readonly basePath: string,
    private readonly outputPath: string
  ) {}

  async runAsync(processAsync: ProcessAsync) {
    try {
      await fs.promises.rm(this.outputPath, {recursive: true, force: true});
      await fs.promises.mkdir(this.outputPath, {recursive: true});
      return await this.execAsync(processAsync);
    } finally {
      await fs.promises.rm(this.outputPath, {recursive: true, force: true});
    }
  }

  private async execAsync(processAsync: ProcessAsync) {
    if (await ffmpegAsync(this.args)) {
      const newNames = await fs.promises.readdir(this.outputPath);
      const newPaths = newNames.map(x => path.join(this.outputPath, x));
      await Promise.all(newPaths.map(x => waitAsync(x)));
      await Promise.all(newPaths.map(x => processAsync(x)));
      await this.moveAsync(newNames);
      return true;
    } else {
      return false;
    }
  }

  private async moveAsync(newNames: Array<string>) {
    for (const newName of newNames) {
      const oldPath = path.join(this.outputPath, newName);
      const newPath = path.join(this.basePath, newName);
      await fs.promises.rename(oldPath, newPath);
    }
    for (const oldPath of await existingAsync(this.baseName, this.basePath)) {
      const name = path.basename(oldPath);
      if (newNames.includes(name)) continue;
      await fs.promises.rm(oldPath);
    }
  }
}

type ProcessAsync = (fullPath: string) => Promise<void>;
