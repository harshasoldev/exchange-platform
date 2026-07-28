# Nova Admin ─ Backend Dockerfile
# Multi-stage build for production

# ─── Development stage ───
FROM node:22-alpine AS development
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm ci
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:dev"]

# ─── Build stage ───
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Production stage ───
FROM node:22-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl tini
RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

USER app
EXPOSE 8000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1
