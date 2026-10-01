import { KeyListPair } from "./KeyListPair.js";

export class TreePair {
  /**
   * @param {KeyListPair} format
   * @param {KeyListPair} value
   */
  constructor(format, value) {
    this.format = format;
    this.value = value;
  }

  /** @readonly @type {KeyListPair} */
  format;
  /** @readonly @type {KeyListPair} */
  value;

  /** @param {string} name */
  get(name) {
    const index = this.format.list.findIndex((x) => x.is(name));
    const field = this.value.list[index];
    return field;
  }

  /** @param {string} name */
  getFloat(name) {
    const match = this.getString(name)?.match(/^(\d+(\.\d*)?)$/);
    const value = match?.[1] ? parseFloat(match[1]) : 0;
    return value;
  }

  /** @param {string} name */
  getString(name) {
    const field = this.get(name);
    const value = field?.text;
    return value;
  }

  /** @param {string} name */
  getTime(name) {
    const match = this.getString(name)?.match(/^(\d+):(\d+):(\d+(\.\d*)?)$/);
    const h = match?.[1] ? parseFloat(match[1]) * 3600 : 0;
    const m = match?.[2] ? parseFloat(match[2]) * 60 : 0;
    const s = match?.[3] ? parseFloat(match[3]) : 0;
    return h + m + s;
  }

  /**
   * @param {string} name
   * @param {Object} value
   */
  set(name, value) {
    const field = this.get(name);
    if (!field) return;
    field.text = value.toString();
  }
}
