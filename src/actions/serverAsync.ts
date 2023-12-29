import * as app from '..';
import * as fastify from 'fastify';
import * as path from 'node:path';
import {Data} from './schemas/Data';
import {FromSchema} from 'json-schema-to-ts';
import {Queue} from './classes/Queue';
const packageData = require('../../package');

export async function serverAsync(options: app.Options) {
  const root = path.join(__dirname, '../../public');
  const queue = await Queue.createAsync('queue.json', createHandler(options));
  const server = fastify.default();
  server.register(require('@fastify/static'), {root});
  server.route(get(queue));
  server.route(post(queue));
  await server.listen({host: '0.0.0.0', port: 7883});
}

function createHandler(options: app.Options) {
  return async (path: string) => {
    await app.actions.parseAsync([path], options);
  };
}

function get(queue: Queue): fastify.RouteOptions {
  return {
    method: 'GET',
    url: '/api/v1',
    handler: (_, res) => {
      res.send({
        name: packageData.name,
        version: packageData.version,
        events: app.logger.all(),
        queue: queue.all()
      });
    }
  };
}

function post(queue: Queue): fastify.RouteOptions {
  return {
    method: 'POST',
    url: '/api/v1',
    schema: {
      body: Data
    },
    handler: (req, res) => {
      const data = req.body as FromSchema<typeof Data>;
      queue.enqueue(data.movieFile?.path);
      queue.enqueue(data.series?.path);
      res.send();
    }
  };
}
