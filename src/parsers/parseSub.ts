import * as ass from 'ass-compiler';
import * as fs from 'fs-extra';

export async function parseSubAsync(filePath: string, options?: IOptions) {
  const text = await fs.readFile(filePath, 'utf8');
  const subtitle = ass.parse(text);
  resize(subtitle, options);
  await fs.writeFile(filePath, ass.stringify(subtitle));
}

function resize(subtitle: ass.ParsedASS, options?: IOptions) {
  const primaryStyle = isNumber(subtitle.info.PlayResY)
    ? fetchPrimaryStyle(subtitle)
    : undefined;
  if (primaryStyle && isNumber(primaryStyle.Fontsize)) {
    const primaryFontSize = parseInt(primaryStyle.Fontsize, 10);
    const primaryMarginV = primaryStyle.MarginV;
    const scaleY = 1 / 360 * parseInt(subtitle.info.PlayResY, 10);
    for (const style of subtitle.styles.style) {
      style.Fontsize = isNumber(style.Fontsize)
        ? String(1 / primaryFontSize * parseInt(style.Fontsize, 10) * fetchFontSize(options) * scaleY)
        : style.Fontsize;
      style.MarginV = style.MarginV === primaryMarginV
        ? String(18 * scaleY)
        : style.MarginV;
    }
  }
}

function fetchFontSize(options?: IOptions) {
  if (options && options.size === 'tiny') return 8;
  if (options && options.size === 'small') return 12;
  if (options && options.size === 'normal') return 16;
  if (options && options.size === 'large') return 20;
  if (options && options.size === 'huge') return 24;
  return 16;
}

function fetchPrimaryStyle(content: ass.ParsedASS) {
  const result = {} as Record<string, number>;
  content.events.dialogue.forEach(c => result[c.Style] = (result[c.Style] ?? 0) + c.End - c.Start);
  const name = Object.entries(result).sort((a, b) => b[1] - a[1]).shift()?.[0];
  return content.styles.style.find(x => x.Name === name);
}

function isNumber(value: string) {
  return /^[0-9]+$/.test(value);
}
