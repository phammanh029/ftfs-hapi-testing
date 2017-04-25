const plugin = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, reply) => {
      return reply({ name: request.params.name });
    }
  });
  return next();
};

plugin.attributes = {
  name: 'hello',
  version: '1.0.0'
};

export default plugin;
