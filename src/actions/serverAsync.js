import http from "node:http";
import path from "node:path";
import packageData from "../../package.json" with { type: "json" };
import { parseAsync } from "./parseAsync.js";
import { Options } from "./Options.js";
let queue = Promise.resolve();

/** @param {Options} options */
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
 * @param {Options} options
 * @param {http.ServerResponse} res
 */
function post(data, options, res) {
  try {
    tryEnqueue(JSON.parse(data.toString("utf-8")), options);
    res.writeHead(204);
  } catch (err) {
    res.writeHead(400);
  } finally {
    res.end();
  }
}

/**
 * @param {unknown} source
 * @param {Options} options
 */
function tryEnqueue(source, options) {
  if (typeof source === "object" && source !== null) {
    for (const [key, value] of Object.entries(source)) {
      if (/Delete|Remove/i.test(key)) continue;
      tryEnqueue(value, options);
    }
  } else if (typeof source === "string") {
    if (!path.isAbsolute(source)) return;
    console.log(`Queueing ${source}`);
    queue = queue.then(() => parseAsync([source], options));
  }
}
