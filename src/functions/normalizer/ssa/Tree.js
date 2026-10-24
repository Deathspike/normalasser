import { KeyListPair } from "./KeyListPair.js";
import { KeyValuePair } from "./KeyValuePair.js";
import { TreePair } from "./TreePair.js";

export class Tree {
  /** @readonly @type {Array<TreePair>} */
  events = [];
  /** @readonly @type {Array<KeyValuePair>} */
  info = [];
  /** @readonly @type {Array<TreePair>} */
  styles = [];

  /** @type {KeyListPair | undefined} */
  #format;
  /** @readonly @type {Array<KeyListPair | KeyValuePair | string>} */
  #lines;
  /** @readonly @type {string} */
  #separator;

  /** @param {string} text */
  constructor(text) {
    this.#lines = [];
    this.#separator = text.match(/\r?\n/)?.[0] ?? "\n";
    this.#parse(text.split(this.#separator));
  }

  toString() {
    return this.#lines.join(this.#separator);
  }

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
      } else {
        switch (mode) {
          case "Events":
            this.#parseEvent(line);
            break;
          case "Info":
            this.#parseInfo(line);
            break;
          case "Styles":
            this.#parseStyle(line);
            break;
          default:
            this.#lines.push(line);
            break;
        }
      }
    }
  }

  /** @param {string} line */
  #parseEvent(line) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.#format = new KeyListPair(line);
      this.#lines.push(this.#format);
    } else if (/^\s*(?:Comment|Dialogue)\s*:/i.test(line) && this.#format) {
      const event = new KeyListPair(line, this.#format.list.length);
      this.events.push(new TreePair(this.#format, event));
      this.#lines.push(event);
    } else {
      this.#lines.push(line);
    }
  }

  /** @param {string} line */
  #parseInfo(line) {
    if (line.includes(":")) {
      const info = new KeyValuePair(line);
      this.info.push(info);
      this.#lines.push(info);
    } else {
      this.#lines.push(line);
    }
  }

  /** @param {string} line */
  #parseStyle(line) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.#format = new KeyListPair(line);
      this.#lines.push(this.#format);
    } else if (/^\s*Style\s*:/i.test(line) && this.#format) {
      const style = new KeyListPair(line, this.#format.list.length);
      this.styles.push(new TreePair(this.#format, style));
      this.#lines.push(style);
    } else {
      this.#lines.push(line);
    }
  }
}
