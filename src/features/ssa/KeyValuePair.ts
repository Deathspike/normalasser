import * as app from '.';
import {split} from './utils/split';

export class KeyValuePair {
  constructor(value: string) {
    const pair = split(value, ':', 2);
    this.key = new app.Field(pair[0]);
    this.value = new app.Field(pair[1]);
  }

  toString() {
    const key = this.key.toString();
    const value = this.value.toString();
    return value ? `${key}:${value}` : key;
  }

  readonly key: app.Field;
  readonly value: app.Field;
}
