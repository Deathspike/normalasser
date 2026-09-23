import * as app from "./index.js";
import { split } from "./utils/split.js";

export class KeyValuePair {
  /** @param {string} value */
  constructor(value) {
    const pair = split(value, ":", 2);
    this.key = new app.Field(pair[0]);
    this.value = new app.Field(pair[1]);
  }

  toString() {
    const key = this.key.toString();
    const value = this.value.toString();
    return value ? `${key}:${value}` : key;
  }

  /** @readonly @type {app.Field} */
  key;
  /** @readonly @type {app.Field} */
  value;
}
