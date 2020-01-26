
const { ApolloServer } = require('apollo-server-lambda')
const { ApolloGateway } = require("@apollo/gateway");

// Initialize an ApolloGateway instance and pass it an array of implementing
// service names and URLs
// url must be gateway url
const gateway = new ApolloGateway({
    serviceList: [
      { name: 'node', url: process.env.NODE_GQL_HOST },
      // more services
    ],
  });
  
  // Pass the ApolloGateway to the ApolloServer constructor
  const server = new ApolloServer({
    gateway,
  
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,

    // fix context
    context: (receivedContext) => ({
      ...receivedContext,
    }),
    playground: {
      endpoint: '/prod/graphql'
    }
  });
  
  // With workaround
  exports.graphql = (event, lambdaContext, callback) => {
    // Playground handler
    if (event.httpMethod === 'GET') {
      server.createHandler()(
        {...event, path: event.requestContext.path || event.path},
        lambdaContext,
        callback,
      );
    } else {
      server.createHandler()(event, lambdaContext, callback);
    }
  };
  
//   server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
//   });


exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});