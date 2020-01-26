const { ApolloServer, gql } = require('apollo-server-lambda');
// const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return { id: "1", username: "@ava" }
    }
  },
  User: {
    __resolveReference(user, { fetchUserById }){
      return fetchUserById(user.id)
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: (receivedContext) => ({
    ...receivedContext,
  }),
  playground: {
    endpoint: '/prod/graphql'
  }
});

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

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

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});