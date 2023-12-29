import * as app from '../..';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
const packageData = require('../../../package');
const rootPath = path.join(os.homedir(), packageData.name);

export class Queue {
  private processQueue = Promise.resolve();
  private writeQueue = Promise.resolve();

  private constructor(
    private readonly filePath: string,
    private readonly handlerAsync: Handler,
    private readonly items: Array<string>
  ) {}

  static async createAsync(fileName: string, handlerAsync: Handler) {
    const filePath = path.join(rootPath, fileName);
    const items = await this.readAsync(filePath);
    const queue = new Queue(filePath, handlerAsync, items);
    queue.processQueue = queue.processQueue.then(() => queue.processAsync());
    return queue;
  }

  private static async readAsync(filePath: string) {
    return await fs.promises
      .readFile(filePath, 'utf-8')
      .then(JSON.parse)
      .catch(() => []);
  }

  all() {
    return this.items.slice();
  }

  enqueue(value?: string) {
    if (!value) return;
    this.items.push(value);
    this.processQueue = this.processQueue.then(() => this.processAsync());
    this.writeQueue = this.writeQueue.then(() => this.writeAsync());
  }

  private async processAsync() {
    while (this.items.length) {
      try {
        await this.handlerAsync(this.items[0]!);
      } catch (error) {
        app.logger.error(error);
      } finally {
        this.items.shift();
        this.writeQueue = this.writeQueue.then(() => this.writeAsync());
      }
    }
  }

  private async writeAsync() {
    try {
      const value = JSON.stringify(this.items, null, 2);
      await fs.promises.mkdir(rootPath, {recursive: true});
      await fs.promises.writeFile(this.filePath, value);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

type Handler = (value: string) => Promise<void>;
