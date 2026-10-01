import { Field } from "./Field.js";
import { split } from "./utils/split.js";

export class KeyListPair {
  /**
   * @param {string} value
   * @param {number} [limit]
   */
  constructor(value, limit) {
    const pair = split(value, ":", 2);
    this.key = new Field(pair[0]);
    this.list = split(pair[1] ?? "", ",", limit).map((x) => new Field(x));
  }

  toString() {
    const key = this.key.toString();
    const list = this.list.map((x) => x.toString()).join(",");
    return list ? `${key}:${list}` : key;
  }

  /** @readonly @type {Field} */
  key;
  /** @readonly @type {Array<Field>} */
  list;
}
