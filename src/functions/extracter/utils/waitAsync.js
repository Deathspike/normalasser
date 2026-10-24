import fs from "node:fs";
const maximumWaitTime = 300_000;
const stableThreshold = 15_000;

/** @param {string} fullPath */
export async function waitAsync(fullPath) {
  const endTime = Date.now() + maximumWaitTime;
  for (;;) {
    const stat = await fs.promises.stat(fullPath).catch(() => {});
    const currentTime = Date.now();
    if (stat && stat.mtimeMs + stableThreshold < currentTime) {
      break;
    } else if (currentTime < endTime) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      throw new Error(`File not stable: ${fullPath}`);
    }
  }
}
