import * as app from '.';
import {getPrimaryStyle} from './utils/getPrimaryStyle';
import {ssa} from '..';

export function normalize(value: string, size: app.Size) {
  const subtitle = new ssa.Tree(value);
  run(subtitle, size);
  return subtitle.toString();
}

function run(subtitle: ssa.Tree, size: app.Size) {
  const primary = getPrimaryStyle(subtitle);
  const primaryFontSize = primary?.getFloat('FontSize');
  const primaryMargin = primary?.getFloat('MarginV');
  if (primaryFontSize) {
    const screen = subtitle.info.find(x => x.key.is('PlayResY'));
    const screenValue = parseFloat(screen?.value.text ?? '') || 270;
    const screenScale = (1 / 360) * screenValue;
    for (const style of subtitle.styles) {
      const styleFontSize = style.getFloat('FontSize');
      const styleMargin = style.getFloat('MarginV');
      if (styleFontSize) {
        const fontScale = (1 / primaryFontSize) * styleFontSize;
        const fontSize = fontSizes[size] * screenScale * fontScale;
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
