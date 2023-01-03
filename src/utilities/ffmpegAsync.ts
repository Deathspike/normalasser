import * as childProcess from 'node:child_process';
import * as path from 'node:path';

export async function ffmpegAsync(args: Array<string>) {
  return await new Promise<string>((resolve, reject) => {
    const result = new Array<Buffer>();
    const process = childProcess.spawn(ffmpeg(), args);
    process.stdout.on('data', x => result.push(x));
    process.stderr.on('data', x => result.push(x));
    process.on('error', reject);
    process.on('exit', () => resolve(Buffer.concat(result).toString('utf8')));
  });
}

function ffmpeg() {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '../../static/ffmpeg');
    case 'win32':
      return path.join(__dirname, '../../static/ffmpeg.exe');
    default:
      return 'ffmpeg';
  }
}
