import * as app from '..';
import * as childProcess from 'node:child_process';

export async function ffprobeAsync(fullPath: string) {
  const args = ['-v', 'quiet', '-print_format', 'json', '-show_streams'];
  const result = await spawnAsync('ffprobe', args.concat(fullPath));
  const text = Buffer.concat(result).toString('utf-8');
  return JSON.parse(text) as app.Metadata;
}

async function spawnAsync(command: string, args: Array<string>) {
  return await new Promise<Array<Buffer>>((resolve, reject) => {
    const result: Array<Buffer> = [];
    const process = childProcess.spawn(command, args);
    process.stdout.on('data', x => result.push(x));
    process.stderr.on('data', x => result.push(x));
    process.on('error', x => reject(x));
    process.on('exit', () => resolve(result));
  });
}
