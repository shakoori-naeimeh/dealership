import 'graphql-import-node';
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { GraphQLContext } from "./context";
import { Vehicle, Sale } from '@prisma/client';

const resolvers = {
  Query: {
    getVehicle: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
      return context.prisma.vehicle.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    addVehicle: async (
      parent: unknown,
      args: { make: string, model: string, year: number, price: number, locationId: string},
      context: GraphQLContext,  
    ) => {
      const newVehicle = await context.prisma.vehicle.create({ data: { ...args } })

      return newVehicle;
    },
    recordSale: async (parent: unknown, args: { vehicleId: string, customerId: string, price: number, date: string }, context: GraphQLContext) => {
      const sale = await context.prisma.sale.create({ data: { ...args } });

      return sale;
    }
  },
  Vehicle: {
    id: (parent: Vehicle) => parent.id,
    make: (parent: Vehicle) => parent.make,
    model: (parent: Vehicle) => parent.model,
    year: (parent: Vehicle) => parent.year,
    price: (parent: Vehicle) => parent.price,
  },
  Sale: {
    id: (parent: Sale) => parent.id,
    vehicleId: (parent: Sale) => parent.vehicleId,
    customerId: (parent: Sale) => parent.customerId,
    price: (parent: Sale) => parent.price,
    date: (parent: Sale) => parent.date,
  
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});