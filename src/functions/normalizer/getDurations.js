import { Tree } from "./ssa/Tree.js";

/** @param {Tree} tree */
export function getDurations(tree) {
  /** @type {Map<string, { duration: number; end: number }>} */
  const entries = new Map();

  for (const event of tree.events
    .filter((event) => event.value.key.is("Dialogue"))
    .toSorted((a, b) => a.getTime("Start") - b.getTime("Start"))) {
    const style = event.getString("Style") ?? "Default";
    const previous = entries.get(style) ?? { duration: 0, end: 0 };
    const start = Math.max(event.getTime("Start"), previous.end);
    const end = Math.max(event.getTime("End"), start);
    const duration = previous.duration + (end - start);
    entries.set(style, { duration, end });
  }

  return entries;
}
