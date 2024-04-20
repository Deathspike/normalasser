import * as fs from 'node:fs';

export async function waitAsync(fullPath: string) {
  let oldSize = -1;
  for (let i = 0; i < 10; i++) {
    const newSize = await fs.promises
      .stat(fullPath)
      .then(x => x.size)
      .catch(() => 0);
    if (!newSize || oldSize !== newSize) {
      oldSize = newSize;
      await new Promise(x => setTimeout(x, 1000));
    } else {
      break;
    }
  }
}
