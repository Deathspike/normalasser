import * as fs from 'node:fs';
import * as path from 'node:path';

export async function existingAsync(baseName: string, basePath: string) {
  const fullNames = await fs.promises.readdir(basePath);
  const fullPaths: Array<string> = [];
  for (const fullName of fullNames) {
    if (!fullName.endsWith('.ass')) continue;
    if (!fullName.startsWith(`${baseName}.`)) continue;
    fullPaths.push(path.join(basePath, fullName));
  }
  return fullPaths;
}
