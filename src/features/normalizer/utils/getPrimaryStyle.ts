import {getDurations} from './getDurations';
import {ssa} from '../..';

export function getPrimaryStyle(subtitle: ssa.Tree) {
  const durations = getDurations(subtitle);
  return get(subtitle, durations);
}

function get(subtitle: ssa.Tree, durations: Map<string, number>) {
  const primaryName = Array.from(durations.entries())
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0];
  const primaryStyle = primaryName
    ? subtitle.styles.find(x => x.get('Name')?.is(primaryName))
    : undefined;
  return primaryStyle
    ? primaryStyle
    : subtitle.styles.find(x => x.get('Name')?.is('Default'));
}
