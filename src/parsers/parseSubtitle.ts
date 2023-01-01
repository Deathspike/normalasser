import * as ass from 'ass-compiler';
import * as fs from 'fs-extra';

export async function parseSubtitleAsync(filePath: string, options?: IOptions) {
  const text = await fs.readFile(filePath, 'utf8');
  const subtitle = ass.parse(text);
  changeScale(subtitle, options);
  await fs.writeFile(filePath, ass.stringify(subtitle));
}

function changeScale(subtitle: ass.ParsedASS, options?: IOptions) {
  const primaryStyle = fetchPrimaryStyle(subtitle);
  if (primaryStyle && /^\d+(?:\.\d+)?$/.test(primaryStyle.Fontsize)) {
    const primaryFontSize = parseInt(primaryStyle.Fontsize, 10);
    const primaryMarginV = primaryStyle.MarginV;
    const scaleY = 1 / 360 * (parseInt(subtitle.info.PlayResY, 10) || 270);
    for (const style of subtitle.styles.style) {
      style.Fontsize = /^\d+(?:\.\d+)?$/.test(style.Fontsize)
        ? String(1 / primaryFontSize * parseInt(style.Fontsize, 10) * fetchFontSize(options) * scaleY)
        : style.Fontsize;
      style.MarginV = style.MarginV === primaryMarginV
        ? String(18 * scaleY)
        : style.MarginV;
    }
  }
}

function fetchFontSize(options?: IOptions) {
  if (options?.size === 'tiny') return 8;
  if (options?.size === 'small') return 12;
  if (options?.size === 'normal') return 16;
  if (options?.size === 'large') return 20;
  if (options?.size === 'huge') return 24;
  return 16;
}

function fetchPrimaryStyle(content: ass.ParsedASS) {
  const result: Record<string, number> = {};
  content.events.dialogue.forEach(c => result[c.Style] = (result[c.Style] ?? 0) + c.End - c.Start);
  const name = Object.entries(result).sort((a, b) => b[1] - a[1]).shift()?.[0];
  return content.styles.style.find(x => x.Name === name);
}
