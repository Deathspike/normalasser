import * as ssa from '..';

export class KeyValuePair {
  constructor(value: string) {
    const pair = ssa.split(value, ':', 2);
    this.key = new ssa.Field(pair[0]);
    this.value = new ssa.Field(pair[1]);
  }

  toString() {
    const key = this.key.toString();
    const value = this.value.toString();
    return value ? `${key}:${value}` : key;
  }

  readonly key: ssa.Field;
  readonly value: ssa.Field;
}
