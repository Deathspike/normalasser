import fs from "node:fs";
const maximumWaitTime = 300000;
const stableThreshold = 15000;

/** @param {string} fullPath */
export async function waitAsync(fullPath) {
  const endTime = Date.now() + maximumWaitTime;
  while (true) {
    const stat = await fs.promises.stat(fullPath).catch(() => {});
    const currentTime = Date.now();
    if (stat && stat.mtimeMs + stableThreshold < currentTime) {
      break;
    } else if (currentTime < endTime) {
      await new Promise((x) => setTimeout(x, 1000));
    } else {
      throw new Error(`File not stable: ${fullPath}`);
    }
  }
}
