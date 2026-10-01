import { Field } from "./Field.js";
import { split } from "./utils/split.js";

export class KeyValuePair {
  /** @param {string} value */
  constructor(value) {
    const pair = split(value, ":", 2);
    this.key = new Field(pair[0]);
    this.value = new Field(pair[1]);
  }

  toString() {
    const key = this.key.toString();
    const value = this.value.toString();
    return value ? `${key}:${value}` : key;
  }

  /** @readonly @type {Field} */
  key;
  /** @readonly @type {Field} */
  value;
}
