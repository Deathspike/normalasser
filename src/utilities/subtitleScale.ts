import * as app from '..';
import * as ass from 'ass-compiler';

export function subtitleScale(subtitle: ass.ParsedASS, options: app.Options) {
  const primaryStyle = fetchPrimaryStyle(subtitle);
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

function fetchPrimaryStyle(content: ass.ParsedASS) {
  const result = new Map<string, number>();
  content.events.dialogue.forEach(x => {
    const duration = x.End - x.Start;
    const value = result.get(x.Style) ?? 0;
    result.set(x.Style, value + duration);
  });
  const name = Array.from(result.entries())
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0];
  return content.styles.style.find(x => x.Name === name);
}

const fontSizes = {
  tiny: 8,
  small: 12,
  normal: 16,
  large: 20,
  huge: 24
};
