export const WebhookMovie = {
  type: 'object',
  properties: {
    folderPath: {type: 'string'}
  },
  required: ['folderPath']
} as const;
