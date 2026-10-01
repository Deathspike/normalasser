import { MetadataStream } from "./MetadataStream.js";

export class ExtractorTracker {
  /** @readonly @type {Record<string, Record<string, number>>} */
  #values;

  constructor() {
    this.#values = {};
  }

  /**
   * @param {string} extension
   * @param {MetadataStream} stream
   */
  add(extension, stream) {
    const language = this.#get(stream);
    const languageId = this.#set(extension, language);
    const languageSuffix = languageId ? `.${languageId}` : "";
    return "." + language + languageSuffix + extension;
  }

  /** @param {MetadataStream} stream */
  #get(stream) {
    const language = getTag(stream, "language") ?? "";
    const value = language.toLowerCase().replace(/[^a-z]/g, "");
    const threeLetterCode = value.substring(0, 3);
    return /^(mis|und|zxx)$/i.test(threeLetterCode) ? "" : threeLetterCode;
  }

  /**
   * @param {string} extension
   * @param {string} language
   */
  #set(extension, language) {
    const source = this.#values[extension] ?? (this.#values[extension] = {});
    const value = (source[language] ?? -1) + 1;
    source[language] = value;
    return value;
  }
}

/**
 * @param {MetadataStream} stream
 * @param {string} name
 */
function getTag(stream, name) {
  if (!stream.tags) return;
  const entries = Object.entries(stream.tags);
  const match = entries.find(([k]) => k.toLowerCase() === name);
  return match?.[1];
}
