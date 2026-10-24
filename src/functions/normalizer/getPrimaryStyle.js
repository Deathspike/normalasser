import { getDurations } from "./getDurations.js";
import { Tree } from "./ssa/Tree.js";

/** @param {Tree} tree */
export function getPrimaryStyle(tree) {
  const primaryName = Array.from(getDurations(tree))
    .toSorted(([, a], [, b]) => b.duration - a.duration)
    .shift()?.[0];
  const primaryStyle = primaryName
    ? tree.styles.find((style) => style.get("Name")?.is(primaryName))
    : undefined;
  return (
    primaryStyle ??
    tree.styles.find((style) => style.get("Name")?.is("Default"))
  );
}
