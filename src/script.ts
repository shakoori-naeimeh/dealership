import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const dealership = await prisma.dealership.create({
    data: {
      name: 'Autocorp',
    }
  })
  const location = await prisma.location.create({
    data: {
      name: 'Autocorp HQ',
      address: '123 Main St',
      dealershipId: dealership.id
    }
  })
  const vehicleOne = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      locationId: location.id,
      price: 25000,
    }
  })
  const vehicleTwo = await prisma.vehicle.create({
    data: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      locationId: location.id,
      price: 75000,
    }
  })
  const customerOne = await prisma.customer.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
    }
  })
  const customerTwo = await prisma.customer.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
    }
  })
  const sale = await prisma.sale.create({
    data: {
      vehicleId: vehicleOne.id,
      customerId: customerOne.id,
      price: vehicleOne.price,
      date: new Date(),
    }
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })