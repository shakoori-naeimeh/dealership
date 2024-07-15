import 'graphql-import-node';
import fastify from "fastify";
import { getGraphQLParameters, processRequest, Request, renderGraphiQL, shouldRenderGraphiQL, sendResult, Response } from "graphql-helix";
import { schema } from "./schema";
import { contextFactory, GraphQLContext } from './context';

async function main() {
  const server = fastify();

  server.route({
    method: ["POST", "GET"],
    url: "/graphql",
    handler: async (req, reply) => {
      const request: Request = {
        headers: req.headers,
        method: req.method,
        query: req.query,
        body: req.body,
      };

      if (shouldRenderGraphiQL(request)) {
        reply.header("Content-Type", "text/html");
        reply.send(
          renderGraphiQL({
            endpoint: "/graphql",
          })
        );

        return;
      }

      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory,
        query,
        variables,
      }) as Response<GraphQLContext, any>;

      if (result.payload.errors) {
        throw new Error("We got an error when processing the request in our system. Please try again later.");
      }

      sendResult(result, reply.raw);
    }
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log(`GraphQL API is running on http://localhost:3000/graphql`);
  });
}

main();