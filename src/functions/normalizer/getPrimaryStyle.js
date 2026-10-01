import { getDurations } from "./getDurations.js";
import { Tree } from "./ssa/Tree.js";

/** @param {Tree} tree */
export function getPrimaryStyle(tree) {
  const primaryName = Array.from(getDurations(tree).entries())
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0];
  const primaryStyle = primaryName
    ? tree.styles.find((x) => x.get("Name")?.is(primaryName))
    : undefined;
  return primaryStyle
    ? primaryStyle
    : tree.styles.find((x) => x.get("Name")?.is("Default"));
}
