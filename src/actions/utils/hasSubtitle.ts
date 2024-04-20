import * as path from 'node:path';

export function hasSubtitle(fileName: string, fileNames: Set<string>) {
  const {name} = path.parse(fileName);
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.ass')) continue;
    if (!fileName.startsWith(`${name}.`)) continue;
    return true;
  }
  return false;
}
