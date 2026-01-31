#!/bin/bash

echo "🚀 Starting Deployment Process..."

# 1. Install Root Dependencies
echo "📦 Installing Frontend Dependencies..."
npm install

# 2. Build Frontend
echo "🏗️ Building Frontend..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ Build failed! 'dist' directory not found."
  exit 1
fi

echo "✅ Frontend Build Complete."

# 3. Setup Backend
echo "🔧 Setting up Backend..."
cd backend
npm install

if [ ! -f ".env" ]; then
    echo "⚠️ .env file missing in backend! Creating from example if possible or requesting manual input."
    # Check if root .env exists
    if [ -f "../.env" ]; then
        cp ../.env .env
        echo "✅ Copied .env from root."
    else
        echo "❌ No .env found. Please create 'backend/.env' with your API keys before running."
        echo "Example: echo 'OPENAI_API_KEY=...' > .env"
        # We don't exit here, just warn, but app might fail to start if keys missing.
    fi
fi

# 4. Start Server
echo "🚀 Starting Server with PM2..."

if command -v pm2 &> /dev/null; then
    pm2 delete podecho 2>/dev/null || true
    pm2 start src/server.ts --interpreter ./node_modules/.bin/ts-node --name "podecho"
    pm2 save
    echo "✅ Application deployed successfully with PM2!"
    echo "🌍 Running on port 3000"
else
    echo "⚠️ PM2 not found. Installing..."
    npm install -g pm2
    pm2 start src/server.ts --interpreter ./node_modules/.bin/ts-node --name "podecho"
    echo "✅ Application deployed successfully!"
fi
