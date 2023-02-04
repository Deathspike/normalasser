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
    const options = {sensitivity: 'accent'};
    return !this.text.localeCompare(value, undefined, options);
  }

  toString() {
    return this.prefix + this.text + this.suffix;
  }

  text: string;
}
