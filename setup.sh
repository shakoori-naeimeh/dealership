#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Step 2: Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev

# Step 3: Run the TypeScript script
echo "Running TypeScript script..."
npx ts-node src/script.ts

# Step 4: Start the development server
echo "Starting the development server..."
npm run dev
