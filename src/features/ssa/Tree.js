import * as app from "./index.js";

export class Tree {
  /** @readonly @type {Array<Object>} */
  #lines;
  /** @readonly @type {string} */
  #separator;
  /** @type {app.KeyListPair | undefined} */
  #format;

  /** @param {string} text */
  constructor(text) {
    this.#lines = [];
    this.#separator = text.match(/\r?\n/)?.[0] ?? "\n";
    this.#parse(text.split(this.#separator));
  }

  toString() {
    return this.#lines.join(this.#separator);
  }

  /** @readonly @type {Array<app.KeyValuePair>} */
  info = [];
  /** @readonly @type {Array<app.TreePair>} */
  styles = [];
  /** @readonly @type {Array<app.TreePair>} */
  events = [];

  /** @param {string[]} lines */
  #parse(lines) {
    let mode = "Unknown";
    for (const line of lines) {
      if (/^\s*\[Script\s+Info\]/i.test(line)) {
        this.#format = undefined;
        mode = "Info";
        this.#lines.push(line);
      } else if (/^\s*\[Events\]/i.test(line)) {
        this.#format = undefined;
        mode = "Events";
        this.#lines.push(line);
      } else if (/^\s*\[V4\+?\s+Styles\]/i.test(line)) {
        this.#format = undefined;
        mode = "Styles";
        this.#lines.push(line);
      } else if (/^\s*\[.*\]/.test(line)) {
        this.#format = undefined;
        mode = "Unknown";
        this.#lines.push(line);
      } else if (mode === "Info") {
        this.#parseInfo(line);
      } else if (mode === "Styles") {
        this.#parseStyle(line);
      } else if (mode === "Events") {
        this.#parseEvent(line);
      } else {
        this.#lines.push(line);
      }
    }
  }

  /** @param {string} line */
  #parseInfo(line) {
    if (line.includes(":")) {
      const info = new app.KeyValuePair(line);
      this.info.push(info);
      this.#lines.push(info);
    } else {
      this.#lines.push(line);
    }
  }

  /** @param {string} line */
  #parseEvent(line) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.#format = new app.KeyListPair(line);
      this.#lines.push(this.#format);
    } else if (/^\s*(?:Comment|Dialogue)\s*:/i.test(line) && this.#format) {
      const event = new app.KeyListPair(line, this.#format.list.length);
      this.events.push(new app.TreePair(this.#format, event));
      this.#lines.push(event);
    } else {
      this.#lines.push(line);
    }
  }

  /** @param {string} line */
  #parseStyle(line) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.#format = new app.KeyListPair(line);
      this.#lines.push(this.#format);
    } else if (/^\s*Style\s*:/i.test(line) && this.#format) {
      const style = new app.KeyListPair(line, this.#format.list.length);
      this.styles.push(new app.TreePair(this.#format, style));
      this.#lines.push(style);
    } else {
      this.#lines.push(line);
    }
  }
}
