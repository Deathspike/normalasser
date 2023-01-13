import {Movie} from './Movie';
import {Series} from './Series';

export const Data = {
  type: 'object',
  properties: {
    movie: Movie,
    series: Series
  }
} as const;
