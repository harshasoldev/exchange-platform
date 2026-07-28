#!/bin/bash
# Nova Admin ─ Setup Script (Sprint 1)
set -e

echo "🚀 Nova Admin ─ Infrastructure Setup"
echo "===================================="

# Check prerequisites
echo -n "📦 Node.js... "
node -v || { echo "MISSING"; exit 1; }
echo "✅"

echo -n "📦 Docker... "
docker --version || { echo "MISSING"; exit 1; }
echo "✅"

echo -n "📦 Docker Compose... "
docker compose version || { echo "MISSING"; exit 1; }
echo "✅"

# Copy environment
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Created .env from .env.example"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Start Docker services
echo "🐳 Starting Docker services..."
docker compose up -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 5

# Run health checks
node scripts/health-check.js

echo ""
echo "✅ Sprint 1 Complete!"
echo "   Next: npm run setup"
