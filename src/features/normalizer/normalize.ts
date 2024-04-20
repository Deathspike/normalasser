import * as app from '.';
import {getPrimaryStyle} from './utils/getPrimaryStyle';
import {ssa} from '..';

export function normalize(subtitle: string, size?: app.Size) {
  const tree = new ssa.Tree(subtitle);
  run(tree, size);
  return tree.toString();
}

function run(tree: ssa.Tree, size?: app.Size) {
  const primary = getPrimaryStyle(tree);
  const primaryFontSize = primary?.getFloat('FontSize');
  const primaryMargin = primary?.getFloat('MarginV');
  if (primaryFontSize) {
    const screen = tree.info.find(x => x.key.is('PlayResY'));
    const screenValue = parseFloat(screen?.value.text ?? '') || 270;
    const screenScale = (1 / 360) * screenValue;
    for (const style of tree.styles) {
      const styleFontSize = style.getFloat('FontSize');
      const styleMargin = style.getFloat('MarginV');
      if (styleFontSize) {
        const fontScale = (1 / primaryFontSize) * styleFontSize;
        const fontSize = fontSizes[size ?? 'normal'] * screenScale * fontScale;
        style.set('FontSize', fontSize);
      }
      if (styleMargin && styleMargin === primaryMargin) {
        const margin = 18 * screenScale;
        style.set('MarginV', margin);
      }
    }
  }
}

const fontSizes = {
  tiny: 8,
  small: 12,
  normal: 16,
  large: 20,
  huge: 24
};
