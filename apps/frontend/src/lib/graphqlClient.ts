import { GraphQLClient } from 'graphql-request';

export const graphqlEndpoint = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL ?? 'http://localhost:1339/graphql';

export const graphQLClient = new GraphQLClient(
  graphqlEndpoint,
  //     , {
  //   headers: {
  //     Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  //   },
  // }
);
