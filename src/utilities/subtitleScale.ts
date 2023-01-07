import * as app from '..';
import * as ass from 'ass-compiler';
import {fetch} from './scale/fetch';

export function subtitleScale(subtitle: ass.ParsedASS, options: app.Options) {
  const primaryStyle = fetch(subtitle);
  if (primaryStyle && /^\d+(\.\d+)?$/.test(primaryStyle.Fontsize)) {
    const baseFontSize = fontSizes[options.size];
    const primaryFontSize = parseFloat(primaryStyle.Fontsize);
    const screenScale = (1 / 360) * (parseFloat(subtitle.info.PlayResY) || 270);
    for (const style of subtitle.styles.style) {
      if (/^\d+(\.\d+)?$/.test(style.Fontsize)) {
        const styleFontSize = parseFloat(style.Fontsize);
        const styleFontScale = (1 / primaryFontSize) * styleFontSize;
        style.Fontsize = String(baseFontSize * screenScale * styleFontScale);
      }
      if (style.MarginV === primaryStyle.MarginV) {
        style.MarginV = String(18 * screenScale);
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
