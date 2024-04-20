import * as app from '.';
import {split} from './utils/split';

export class KeyListPair {
  constructor(value: string, limit?: number) {
    const pair = split(value, ':', 2);
    this.key = new app.Field(pair[0]);
    this.list = split(pair[1] ?? '', ',', limit).map(x => new app.Field(x));
  }

  toString() {
    const key = this.key.toString();
    const list = this.list.map(x => x.toString()).join(',');
    return list ? `${key}:${list}` : key;
  }

  readonly key: app.Field;
  readonly list: Array<app.Field>;
}
