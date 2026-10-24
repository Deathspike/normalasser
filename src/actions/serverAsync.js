import http from "node:http";
import path from "node:path";

import { Options } from "./Options.js";
import { parseAsync } from "./parseAsync.js";
import { getRequestBodyAsync } from "./utils/getRequestBodyAsync.js";
import { getServerPort } from "./utils/getServerPort.js";

let queue = Promise.resolve();

/**
 * @param {Options} options
 * @param {number} [port]
 */
export async function serverAsync(options, port = 7883) {
  await new Promise((resolve, reject) => {
    const server = http
      .createServer((req, res) => void serveAsync(options, req, res))
      .on("close", resolve)
      .on("error", reject);
    server.listen(port, () => {
      const serverPort = getServerPort(server);
      console.log(`Running on http://localhost:${serverPort.toString()}/`);
    });
  });
}

/**
 * @param {unknown} source
 * @param {Options} options
 */
function enqueue(source, options) {
  if (typeof source === "string" && path.isAbsolute(source)) {
    console.log(`Queueing ${source}`);
    queue = queue.then(() => parseAsync([source], options));
  } else if (typeof source === "object" && source !== null) {
    const ignoreExpression = /Delete|Remove/i;
    for (const [key, value] of Object.entries(source)) {
      if (!ignoreExpression.test(key)) {
        enqueue(value, options);
      }
    }
  }
}

/**
 * @param {Options} options
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function serveAsync(options, request, response) {
  try {
    if (request.method === "POST") {
      const result = await getRequestBodyAsync(request);
      const text = result.toString("utf8");
      enqueue(JSON.parse(text), options);
      response.writeHead(204);
      response.end();
    } else {
      response.writeHead(404);
      response.end();
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end();
  }
}
