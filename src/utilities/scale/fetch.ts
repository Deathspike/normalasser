import * as ass from 'ass-compiler';
import {check} from './check';

export function fetch(subtitle: ass.ParsedASS) {
  const result = check(subtitle);
  const name = run(result);
  return subtitle.styles.style.find(x => x.Name === name);
}

function run(result: ReturnType<typeof check>) {
  return Array.from(result.entries())
    .sort((a, b) => b[1].duration - a[1].duration)
    .shift()?.[0];
}
