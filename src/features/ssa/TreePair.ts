import * as app from '.';

export class TreePair {
  constructor(
    readonly format: app.KeyListPair,
    readonly value: app.KeyListPair
  ) {}

  get(name: string) {
    const index = this.format.list.findIndex(x => x.is(name));
    const field = this.value.list[index];
    return field;
  }

  getFloat(name: string) {
    const match = this.getString(name)?.match(/^(\d+(\.\d*)?)$/);
    const value = match ? parseFloat(match[1]!) : 0;
    return value;
  }

  getString(name: string) {
    const field = this.get(name);
    const value = field?.text;
    return value;
  }

  getTime(name: string) {
    const match = this.getString(name)?.match(/^(\d+):(\d+):(\d+(\.\d*)?)$/);
    const h = match ? parseFloat(match[1]!) * 3600 : 0;
    const m = match ? parseFloat(match[2]!) * 60 : 0;
    const s = match ? parseFloat(match[3]!) : 0;
    return h + m + s;
  }

  set(name: string, value: Object) {
    const field = this.get(name);
    if (!field) return;
    field.text = value.toString();
  }
}
