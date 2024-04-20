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

  async runAsync() {
    try {
      await fs.promises.rm(this.outputPath, {recursive: true, force: true});
      await fs.promises.mkdir(this.outputPath, {recursive: true});
      return await this.extractAsync();
    } finally {
      await fs.promises.rm(this.outputPath, {recursive: true, force: true});
    }
  }

  private async extractAsync() {
    if (await ffmpegAsync(this.args)) {
      await waitAsync(this.outputPath);
      const existingPaths = await existingAsync(this.baseName, this.basePath);
      return await this.finishAsync(existingPaths);
    } else {
      return;
    }
  }

  private async finishAsync(existingPaths: Array<string>) {
    const newNames = await fs.promises.readdir(this.outputPath);
    const newPaths: Array<string> = [];
    for (const tempName of newNames) {
      const oldPath = path.join(this.outputPath, tempName);
      const newPath = path.join(this.basePath, tempName);
      await fs.promises.rename(oldPath, newPath);
      newPaths.push(newPath);
    }
    for (const existingPath of existingPaths) {
      const name = path.basename(existingPath);
      if (newNames.includes(name)) continue;
      await fs.promises.rm(existingPath);
    }
    return newPaths;
  }
}
