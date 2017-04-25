import { Server } from 'hapi';

const server = new Server();

import HelloPlugin from './plugins/hello';

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 4000;

server.connection({
  port, router: {
    isCaseSensitive: false
  },
  routes: {
    cors: true
  }
});

server.register([
  require('inert'),
  require('vision'),
  require('blipp'),
  require('tv'),
  require('hapi-async-handler'),
  {
    register: require('good'),
    options: {
      ops: {
        interval: 5000
      },
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              log: '*',
              response: '*', request: '*', error: '*'
            }]
          },
          {
            module: 'good-console'
          }, 'stdout']
      }
    }
  },
  {
    register: require('hapi-swagger'),
    options: {
      cors: true,
      jsonEditor: true,
      documentationPath: '/',
      info: {
        title: 'Example',
        version: '1.0.0',
        description: 'An example api'
      }
    }
  },
  HelloPlugin
], err => {
  if (err) throw err;

  if (env !== 'testing') {
    server.start(err => {
      if (err) throw err;
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }

});

export default server;
