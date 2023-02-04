import * as ssa from '..';

export class Tree {
  private readonly lines = new Array<Object>();
  private readonly separator: string;
  private format?: ssa.KeyListPair;

  constructor(text: string) {
    this.separator = text.match(/\r?\n/)?.[0] ?? '\n';
    this.parse(text.split(this.separator));
    delete this.format;
  }

  toString() {
    return this.lines.join(this.separator);
  }

  readonly info = new Array<ssa.KeyValuePair>();
  readonly styles = new Array<ssa.TreePair>();
  readonly events = new Array<ssa.TreePair>();

  private parse(lines: Array<string>) {
    let mode = Mode.Unknown;
    for (const line of lines) {
      if (/^\s*\[Script\s+Info\]/i.test(line)) {
        delete this.format;
        mode = Mode.Info;
        this.lines.push(line);
      } else if (/^\s*\[Events\]/i.test(line)) {
        delete this.format;
        mode = Mode.Events;
        this.lines.push(line);
      } else if (/^\s*\[V4\+?\s+Styles\]/i.test(line)) {
        delete this.format;
        mode = Mode.Styles;
        this.lines.push(line);
      } else if (/^\s*\[.*\]/.test(line)) {
        delete this.format;
        mode = Mode.Unknown;
        this.lines.push(line);
      } else if (mode === Mode.Info) {
        this.parseInfo(line);
      } else if (mode === Mode.Styles) {
        this.parseStyle(line);
      } else if (mode === Mode.Events) {
        this.parseEvent(line);
      } else {
        this.lines.push(line);
      }
    }
  }

  private parseInfo(line: string) {
    if (/:/.test(line)) {
      const info = new ssa.KeyValuePair(line);
      this.info.push(info);
      this.lines.push(info);
    } else {
      this.lines.push(line);
    }
  }

  private parseEvent(line: string) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.format = new ssa.KeyListPair(line);
      this.lines.push(this.format);
    } else if (/^\s*(?:Comment|Dialogue)\s*:/i.test(line) && this.format) {
      const event = new ssa.KeyListPair(line, this.format.list.length);
      this.events.push(new ssa.TreePair(this.format, event));
      this.lines.push(event);
    } else {
      this.lines.push(line);
    }
  }

  private parseStyle(line: string) {
    if (/^\s*Format\s*:/i.test(line)) {
      this.format = new ssa.KeyListPair(line);
      this.lines.push(this.format);
    } else if (/^\s*Style\s*:/i.test(line) && this.format) {
      const style = new ssa.KeyListPair(line, this.format.list.length);
      this.styles.push(new ssa.TreePair(this.format, style));
      this.lines.push(style);
    } else {
      this.lines.push(line);
    }
  }
}

enum Mode {
  Unknown,
  Info,
  Styles,
  Events
}
