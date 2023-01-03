const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
let apiUrl =
  'https://api.github.com/repos/Deathspike/animesync/contents/static/download/';
let rawUrl =
  'https://github.com/Deathspike/animesync/raw/master/static/download/';
let staticPath = path.join(__dirname, 'static');

async function checksumAsync(remotePath) {
  return await fetch(new URL(path.dirname(remotePath), apiUrl).toString())
    .then(x => x.json())
    .then(x => x.find(x => x.name === path.basename(remotePath)).sha);
}

async function downloadAsync(localPath, remotePath) {
  const response = await fetch(new URL(remotePath, rawUrl).toString());
  const blob = await response.arrayBuffer();
  await fs.promises.writeFile(localPath, zlib.gunzipSync(blob));
}

async function ffmpegAsync(localName, remotePath) {
  const hashPath = path.join(staticPath, `${localName}.cks`);
  const localHash = await fs.promises
    .readFile(hashPath)
    .then(String)
    .catch(() => {});
  const remoteHash = await checksumAsync(remotePath);
  if (localHash !== remoteHash) {
    await fs.promises.mkdir(staticPath, {recursive: true});
    await downloadAsync(path.join(staticPath, localName), remotePath);
    await fs.promises.chmod(path.join(staticPath, localName), '755');
    await fs.promises.writeFile(hashPath, remoteHash);
  }
}

switch (process.platform) {
  case 'darwin':
    ffmpegAsync('ffmpeg', 'mac/ffmpeg.gz');
    break;
  case 'linux':
    ffmpegAsync('ffmpeg', 'linux/ffmpeg.gz');
    break;
  case 'win32':
    ffmpegAsync('ffmpeg.exe', 'windows/ffmpeg.exe.gz');
    break;
}
