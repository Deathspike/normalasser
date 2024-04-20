import * as childProcess from 'node:child_process';

export async function ffmpegAsync(args: Array<string>) {
  let isSuccess = false;
  return new Promise<boolean>(resolve => {
    const handler = onData.bind(() => (isSuccess = true));
    const process = childProcess.spawn('ffmpeg', args);
    process.stdout.on('data', handler);
    process.stderr.on('data', handler);
    process.on('error', () => {});
    process.on('exit', () => resolve(isSuccess));
  });
}

function onData(this: () => void, buffer: Buffer) {
  for (const message of buffer.toString().split('\n')) {
    if (!/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/.test(message)) continue;
    this();
  }
}
