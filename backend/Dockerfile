# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/src ./src

# Cloud Run sets the PORT environment variable.
# We default to 8080 if not set.
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/server.js"]
