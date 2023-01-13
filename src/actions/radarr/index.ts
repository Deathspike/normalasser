import * as fastify from 'fastify';
import {FromSchema} from 'json-schema-to-ts';
import {WebhookData} from './WebhookData';

export function radarr(enqueue: (path: string) => void): fastify.RouteOptions {
  return {
    method: 'POST',
    url: '/radarr',
    schema: {
      body: WebhookData
    },
    handler: async (req, res) => {
      const data = req.body as FromSchema<typeof WebhookData>;
      enqueue(data.movie.folderPath);
      res.status(200);
    }
  };
}
