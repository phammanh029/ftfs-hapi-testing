import Test from 'ava';
import { Server } from 'hapi';

import Plugin from '../src/plugins/hello';

Test.beforeEach(t => {
  const server = new Server({});
  server.connection({});

  return new Promise((resolve, reject) => {
    server.register(Plugin, err => {
      if (err) return reject(err);

      t.context = server;
      return resolve();
    })
  })
});

Test('returns a valid payload', async t => {
  const server = t.context;

  const res = await server.inject('/bob');
  t.is(res.statusCode, 202);
  t.deepEqual(res.result, { name: 'bob' });
});
