import { getDurations } from "./getDurations.js";
import { ssa } from "../../index.js";

/** @param {ssa.Tree} tree */
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
