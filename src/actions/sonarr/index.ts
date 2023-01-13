import * as fastify from 'fastify';
import {FromSchema} from 'json-schema-to-ts';
import {WebhookPayload} from './WebhookPayload';

export function sonarr(enqueue: (path: string) => void): fastify.RouteOptions {
  return {
    method: 'POST',
    url: '/sonarr',
    schema: {
      body: WebhookPayload
    },
    handler: async (req, res) => {
      const data = req.body as FromSchema<typeof WebhookPayload>;
      enqueue(data.series.path);
      res.status(200);
    }
  };
}
