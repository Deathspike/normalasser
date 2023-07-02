import * as ass from '../ass';
import {check} from './check';

export function fetch(subtitle: ass.Tree) {
  const result = check(subtitle);
  const primaryName = run(result);
  const primaryStyle = primaryName
    ? subtitle.styles.find(x => x.get('Name')?.is(primaryName))
    : undefined;
  return primaryStyle
    ? primaryStyle
    : subtitle.styles.find(x => x.get('Name')?.is('Default'));
}

function run(result: ReturnType<typeof check>) {
  return Array.from(result.entries())
    .sort((a, b) => b[1].duration - a[1].duration)
    .shift()?.[0];
}
