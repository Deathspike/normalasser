import * as app from '..';
import * as ass from './ass';
import {fetch} from './scale/fetch';

export function subtitleScale(value: string, options: app.Options) {
  const subtitle = new ass.Tree(value);
  run(subtitle, options);
  return subtitle.toString();
}

function run(subtitle: ass.Tree, options: app.Options) {
  const primary = fetch(subtitle);
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
        const fontSize = fontSizes[options.size] * screenScale * fontScale;
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
