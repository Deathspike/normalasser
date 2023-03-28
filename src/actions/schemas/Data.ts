import {Ref} from './Ref';

export const Data = {
  type: 'object',
  properties: {
    isUpgrade: {type: 'boolean'},
    movieFile: Ref,
    series: Ref
  }
} as const;
