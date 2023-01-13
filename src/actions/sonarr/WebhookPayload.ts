import {WebhookSeries} from './WebhookSeries';

export const WebhookPayload = {
  type: 'object',
  properties: {
    series: WebhookSeries
  },
  required: ['series']
} as const;
