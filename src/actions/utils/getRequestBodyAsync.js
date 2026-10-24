import http from "node:http";

/**
 * @param {http.IncomingMessage} request
 * @returns {Promise<Buffer>}
 */
export async function getRequestBodyAsync(request) {
  return await new Promise((resolve, reject) => {
    /** @type {Uint8Array<ArrayBufferLike>[]} */
    const data = [];
    request.on("data", (chunk) => data.push(chunk));
    request.on("end", () => resolve(Buffer.concat(data)));
    request.on("error", (error) => reject(error));
  });
}
