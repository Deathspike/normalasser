import * as fastify from 'fastify';
import {FromSchema} from 'json-schema-to-ts';
import {WebhookData} from './WebhookData';

export function sonarr(enqueue: (path: string) => void): fastify.RouteOptions {
  return {
    method: 'POST',
    url: '/sonarr',
    schema: {
      body: WebhookData
    },
    handler: async (req, res) => {
      const data = req.body as FromSchema<typeof WebhookData>;
      enqueue(data.series.path);
      res.status(200);
    }
  };
}
