import * as childProcess from 'child_process';
import * as path from 'path';

export async function ffmpegAsync(args: Array<string>) {
  return await new Promise<string>((resolve, reject) => {
    const result: Array<Buffer> = [];
    const process = childProcess.spawn(ffmpeg(), args);
    process.stdout.on('data', (chunk: Buffer) => result.push(chunk));
    process.stderr.on('data', (chunk: Buffer) => result.push(chunk));
    process.on('error', reject);
    process.on('exit', () => resolve(Buffer.concat(result).toString('utf8')));
  });
}

function ffmpeg() {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '../static/ffmpeg');
    case 'win32':
      return path.join(__dirname, '../static/ffmpeg.exe');
    default:
      return 'ffmpeg';
  }
}
