export const WebhookSeries = {
  type: 'object',
  properties: {
    path: {type: 'string'}
  },
  required: ['path']
} as const;
