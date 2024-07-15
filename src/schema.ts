import 'graphql-import-node';
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { GraphQLContext } from "./context";
import { Vehicle, Sale } from '@prisma/client';
import { Prisma } from '@prisma/client';

const resolvers = {
  Query: {
    getVehicle: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
      return context.prisma.vehicle.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    getVehicles: async (parent: unknown, args: { model: string, make: string, year: number }, context: GraphQLContext) => {
      if(!args.make && !args.model && !args.year) {
        throw new Error("Please prvide at lease one search criteria (make, model, year)")
      }

      const searchCriteria = []
      if (args.make) {
        searchCriteria.push({ make: { contains: args.make, mode: 'insensitive' } } as Prisma.VehicleWhereInput);
      }
      if (args.model) {
          searchCriteria.push({ model: { contains: args.model, mode: 'insensitive' } } as Prisma.VehicleWhereInput);
      }
      if (args.year) {
          searchCriteria.push({ year: args.year } as Prisma.VehicleWhereInput);
      }

      if(searchCriteria.length === 1) {
        return context.prisma.vehicle.findMany({ where: searchCriteria[0] })
      } else {
        return context.prisma.vehicle.findMany({ where: { AND: searchCriteria } })
      }
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