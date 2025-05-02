#!/bin/bash

# Install production dependencies
npm install --save \
  @supabase/supabase-js \
  cors \
  discord.js \
  dotenv \
  express \
  express-validator \
  firebase-admin \
  jsonwebtoken \
  pg \
  winston

# Install development dependencies
npm install --save-dev \
  @types/cors \
  @types/express \
  @types/jest \
  @types/jsonwebtoken \
  @types/node \
  @types/pg \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  jest \
  ts-jest \
  ts-node-dev \
  typescript

# Create necessary directories
mkdir -p src/{controllers,middlewares,models,routes,services,utils,types} 