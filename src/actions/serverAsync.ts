import * as app from '..';
import * as http from 'node:http';
import * as path from 'node:path';
let packageData = require('../../package.json');
let queue = Promise.resolve();

export async function serverAsync(options: app.Options) {
  const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
      const data: Array<Buffer> = [];
      req.on('data', x => data.push(x));
      req.on('end', () => post(Buffer.concat(data), options, res));
    } else {
      res.write(`${packageData.name}:${packageData.version}`);
      res.end();
    }
  });
  server.listen(7883, () => {
    console.log('Listening on http://127.0.0.1:7883/');
  });
}

function post(data: Buffer, options: app.Options, res: http.ServerResponse) {
  try {
    tryEnqueue(JSON.parse(data.toString('utf-8')), options);
  } catch (err) {
    res.writeHead(500);
  } finally {
    res.end();
  }
}

function tryEnqueue(source: any, options: app.Options) {
  if (typeof source === 'object') {
    if (!source) return;
    const keys = Object.keys(source).filter(x => !/Delete|Remove/i.test(x));
    keys.forEach(x => tryEnqueue(source[x], options));
  } else if (typeof source === 'string') {
    if (!path.isAbsolute(source)) return;
    console.log(`Queueing ${source}`);
    queue = queue.then(() => app.actions.parseAsync([source], options));
  }
}
