import * as app from "../index.js";
import * as http from "node:http";
import * as path from "node:path";
import packageData from "../../package.json" with { type: "json" };
let queue = Promise.resolve();

/** @param {app.Options} options */
export async function serverAsync(options) {
  const server = http.createServer((req, res) => {
    if (req.method === "POST") {
      /** @type {Uint8Array<ArrayBufferLike>[]} */
      const data = [];
      req.on("data", (x) => data.push(x));
      req.on("end", () => post(Buffer.concat(data), options, res));
    } else {
      res.write(`${packageData.name}:${packageData.version}`);
      res.end();
    }
  });
  server.listen(7883, () => {
    console.log("Listening on http://127.0.0.1:7883/");
  });
}

/**
 * @param {Buffer} data
 * @param {app.Options} options
 * @param {http.ServerResponse} res
 */
function post(data, options, res) {
  try {
    tryEnqueue(JSON.parse(data.toString("utf-8")), options);
  } catch (err) {
    res.writeHead(500);
  } finally {
    res.end();
  }
}

/**
 * @param {unknown} source
 * @param {app.Options} options
 */
function tryEnqueue(source, options) {
  if (typeof source === "object" && source) {
    for (const [key, value] of Object.entries(source)) {
      if (/Delete|Remove/i.test(key)) continue;
      tryEnqueue(value, options);
    }
  } else if (typeof source === "string") {
    if (!path.isAbsolute(source)) return;
    console.log(`Queueing ${source}`);
    queue = queue.then(() => app.actions.parseAsync([source], options));
  }
}
