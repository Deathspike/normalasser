import { getPrimaryStyle } from "./getPrimaryStyle.js";
import { Tree } from "./ssa/Tree.js";

/**
 * @param {string} subtitle
 * @param {number} [size]
 */
export function normalize(subtitle, size) {
  const tree = new Tree(subtitle);
  const primary = getPrimaryStyle(tree);
  const primaryFontSize = primary?.getFloat("FontSize");
  const primaryMargin = primary?.getFloat("MarginV");
  if (primaryFontSize) {
    const screen = tree.info.find((x) => x.key.is("PlayResY"));
    const screenValue = parseFloat(screen?.value.text ?? "") || 270;
    const screenScale = (1 / 360) * screenValue;
    for (const style of tree.styles) {
      const styleFontSize = style.getFloat("FontSize");
      const styleMargin = style.getFloat("MarginV");
      if (styleFontSize) {
        const fontScale = (1 / primaryFontSize) * styleFontSize;
        const fontSize = (size ?? 16) * screenScale * fontScale;
        style.set("FontSize", fontSize);
      }
      if (styleMargin && styleMargin === primaryMargin) {
        const margin = 18 * screenScale;
        style.set("MarginV", margin);
      }
    }
  }
  return tree.toString();
}
