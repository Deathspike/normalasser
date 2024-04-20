import * as app from '.';

export class ExtractorTracker {
  private readonly values: Record<string, Record<string, number>> = {};

  add(extension: string, stream: app.MetadataStream) {
    const language = this.get(stream);
    const languageId = this.set(extension, language);
    const languageSuffix = languageId ? `.${languageId}` : '';
    return '.' + language + languageSuffix + extension;
  }

  private get(stream: app.MetadataStream) {
    const language = getTag(stream, 'language') ?? '';
    const value = language.toLowerCase().replace(/[^a-z]/g, '');
    const threeLetterCode = value.substring(0, 3);
    return /^(mis|und|zxx)$/i.test(threeLetterCode) ? '' : threeLetterCode;
  }

  private set(extension: string, language: string) {
    const source = this.values[extension] ?? (this.values[extension] = {});
    const value = (source[language] ?? -1) + 1;
    source[language] = value;
    return value;
  }
}

function getTag(stream: app.MetadataStream, name: string) {
  if (!stream.tags) return;
  const entries = Object.entries(stream.tags);
  const match = entries.find(([k]) => k.toLowerCase() === name);
  return match?.[1];
}
