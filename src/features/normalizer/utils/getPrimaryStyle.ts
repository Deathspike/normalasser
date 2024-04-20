import {getDurations} from './getDurations';
import {ssa} from '../..';

export function getPrimaryStyle(tree: ssa.Tree) {
  const durations = getDurations(tree);
  return get(tree, durations);
}

function get(tree: ssa.Tree, durations: Map<string, number>) {
  const primaryName = Array.from(durations.entries())
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0];
  const primaryStyle = primaryName
    ? tree.styles.find(x => x.get('Name')?.is(primaryName))
    : undefined;
  return primaryStyle
    ? primaryStyle
    : tree.styles.find(x => x.get('Name')?.is('Default'));
}
