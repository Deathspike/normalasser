import {WebhookMovie} from './WebhookMovie';

export const WebhookData = {
  type: 'object',
  properties: {
    movie: WebhookMovie
  },
  required: ['movie']
} as const;
