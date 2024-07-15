#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Step 2: Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for the PostgreSQL container to be fully ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec -it mydb pg_isready; do
  sleep 1
done

# Step 3: Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev

# Step 4: Run the TypeScript script
echo "Running TypeScript script..."
npx ts-node src/script.ts

# Step 5: Start the development server
echo "Starting the development server..."
npm run dev