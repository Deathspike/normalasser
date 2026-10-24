import http from "node:http";

/** @param {http.Server} server */
export function getServerPort(server) {
  const address = server.address();
  if (typeof address === "string") {
    throw new TypeError("Invalid address (pipe or domain socket)");
  } else if (address) {
    return address.port;
  } else {
    throw new Error("Invalid address (not listening)");
  }
}
