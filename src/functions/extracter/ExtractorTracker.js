import { MetadataStream } from "./MetadataStream.js";

export class ExtractorTracker {
  /** @readonly @type {Map<string, Map<string, number>>} */
  #values;

  constructor() {
    this.#values = new Map();
  }

  /**
   * @param {string} extension
   * @param {MetadataStream} stream
   */
  add(extension, stream) {
    const language = this.#get(stream);
    const languageId = this.#set(extension, language);
    const languagePrefix = language ? `.${language}` : "";
    const languageSuffix = languageId ? `.${languageId.toString()}` : "";
    return languagePrefix + languageSuffix + extension;
  }

  /** @param {MetadataStream} stream */
  #get(stream) {
    const language = getTag(stream, "language") ?? "";
    const value = language.toLowerCase().replaceAll(/[^a-z]/g, "");
    const threeLetterCode = value.slice(0, 3);
    return /^(mis|und|zxx)$/i.test(threeLetterCode) ? "" : threeLetterCode;
  }

  /**
   * @param {string} extension
   * @param {string} language
   */
  #set(extension, language) {
    /** @type {Map<string, number>} */
    const source = this.#values.get(extension) ?? new Map();
    this.#values.set(extension, source);
    const value = (source.get(language) ?? -1) + 1;
    source.set(language, value);
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
  const match = entries.find(([key]) => key.toLowerCase() === name);
  return match?.[1];
}
