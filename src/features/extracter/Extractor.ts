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
      return await this.extractAsync(processAsync);
    } finally {
      await fs.promises.rm(this.outputPath, {recursive: true, force: true});
    }
  }

  private async extractAsync(processAsync: ProcessAsync) {
    if (await ffmpegAsync(this.args)) {
      const tempNames = await fs.promises.readdir(this.outputPath);
      const tempPaths = tempNames.map(x => path.join(this.outputPath, x));
      await Promise.all(tempPaths.map(x => waitAsync(x)));
      await Promise.all(tempPaths.map(x => processAsync(x)));
      await this.moveAsync(tempNames);
      return true;
    } else {
      return false;
    }
  }

  private async moveAsync(tempNames: Array<string>) {
    for (const tempName of tempNames) {
      const oldPath = path.join(this.outputPath, tempName);
      const newPath = path.join(this.basePath, tempName);
      await fs.promises.rename(oldPath, newPath);
    }
    for (const fullPath of await existingAsync(this.baseName, this.basePath)) {
      const name = path.basename(fullPath);
      if (tempNames.includes(name)) continue;
      await fs.promises.rm(fullPath);
    }
  }
}

type ProcessAsync = (fullPath: string) => Promise<void>;
