#!/bin/bash

# Install dependencies
npm install

# Install type declarations
npm install --save-dev @types/firebase-functions @types/firebase-admin @types/cors @types/axios

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file from .env.example. Please update it with your Together API key."
fi

echo "Setup complete! Next steps:"
echo "1. Update the .env file with your Together API key"
echo "2. Run 'npm run build' to compile the TypeScript code"
echo "3. Run 'npm run serve' to start the local emulator" 