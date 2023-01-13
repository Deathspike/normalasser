import * as app from '..';
import * as fastify from 'fastify';
import {radarr} from './radarr';
import {sonarr} from './sonarr';
let queue = Promise.resolve();

export async function serverAsync(options: app.Options) {
  const server = fastify.default();
  server.route(radarr(enqueue.bind(options)));
  server.route(sonarr(enqueue.bind(options)));
  await server.listen({host: '0.0.0.0', port: 7883});
}

function enqueue(this: app.Options, path: string) {
  queue = queue.then(() => app.actions.parseAsync([path], this));
}
