# Hapi Testing

> Testing using Hapi and AVA

## Getting Started 

[AVA](https://github.com/avajs/ava) is a test runner.  All it does it run your tests for you.  The reason that I use it is because of speed. I can use ava without a mocha/chai combination. 

To get started, `npm install` or `yarn`.  When everything is installed, the next command you should always run is `npm test` or `yarn test`.

I created a plugin that simply "echos" the name that was passed in as a parameter.

```js
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

```

One really handy thing about Hapi is you don't need to start the server or load all of it's plugins to test functionality.  I prefer to just create a hapi server for each test that I run.  To setup a server for each test run we have to use the `.beforeEach` provided by AVA.  On top of that we need to pass the newly created server back to this object called `context`.  [More Information about context here](https://github.com/avajs/ava#test-context)

```js
// Ths code is ran before every test.  Notice we create a server, and register our plugin everytime a test is ran..
Test.beforeEach(t => {
  const server = new Server({});
  server.connection({});

  // Wrap the server.register (which is a callback) in a promise so we don't have to use the weird Ava callback funciton.
  return new Promise((resolve, reject) => {
    server.register(Plugin, err => {
      
      // Something happened tell the promise to abandon ship.
      if (err) return reject(err);
      
      // Everything is golden, set the context to our server
      t.context = server;
      
      // Tell the promise we are done
      return resolve();
    })
  })
});
```

With the `.beforeEach` setup properly we can write a simple test.  Using Hapi's [server.inject](https://hapijs.com/api#serverinjectoptions-callback) function we can execute a request without starting up a server. 

```js
// Grab the server from our context (from above)
Test('returns a valid payload', async t => {
  
  // Grab the server from our context (from above)
  const server = t.context;
  
  // Issue a request, then wait (await) until the request is done.
  const res = await server.inject('/bob');
  
  // Was it a 200?
  t.is(res.statusCode, 200);
  
  // Did it send back what we thought?
  t.deepEqual(res.result, { name: 'bob' });
});
```

That's it to testing a simple hapi application. 

Ava is the test runner, and server.inject fires off requests allowing you to determine if it was successful or not. If you use the plugin architecture you are honestly done with testing. 
