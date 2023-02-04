import * as ssa from '..';

export class KeyListPair {
  constructor(value: string, limit?: number) {
    const pair = ssa.split(value, ':', 2);
    this.key = new ssa.Field(pair[0]);
    this.list = ssa.split(pair[1] ?? '', ',', limit).map(x => new ssa.Field(x));
  }

  toString() {
    const key = this.key.toString();
    const list = this.list.map(x => x.toString()).join(',');
    return list ? `${key}:${list}` : key;
  }

  readonly key: ssa.Field;
  readonly list: Array<ssa.Field>;
}
