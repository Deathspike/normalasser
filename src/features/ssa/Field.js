export class Field {
  /** @readonly @type {string} */
  #prefix;
  /** @readonly @type {string} */
  #suffix;

  /** @param {string} [value] */
  constructor(value) {
    const match = value?.match(/^(\s*)(.+?)(\s*)$/);
    this.#prefix = match?.[1] ?? "";
    this.#suffix = match?.[3] ?? "";
    this.text = match?.[2] ?? "";
  }

  /** @param {string} value */
  is(value) {
    return !this.text.localeCompare(value, undefined, {
      sensitivity: "accent",
    });
  }

  toString() {
    return this.#prefix + this.text + this.#suffix;
  }

  /** @type {string} */
  text;
}
