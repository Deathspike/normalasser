import {WebhookSeries} from './WebhookSeries';

export const WebhookData = {
  type: 'object',
  properties: {
    series: WebhookSeries
  },
  required: ['series']
} as const;
