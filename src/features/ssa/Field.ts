export class Field {
  private readonly prefix: string;
  private readonly suffix: string;

  constructor(value?: string) {
    const match = value?.match(/^(\s*)(.+?)(\s*)$/);
    this.prefix = (match && match[1]) ?? '';
    this.suffix = (match && match[3]) ?? '';
    this.text = (match && match[2]) ?? '';
  }

  is(value: string) {
    return !this.text.localeCompare(value, undefined, {sensitivity: 'accent'});
  }

  toString() {
    return this.prefix + this.text + this.suffix;
  }

  text: string;
}
