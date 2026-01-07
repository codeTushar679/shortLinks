FROM node:20-alpine3.20 AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Build stage
FROM node:20-alpine3.20 AS builder

WORKDIR /app

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

COPY . .
COPY --from=base /app/node_modules ./node_modules
RUN npm run build

# Production stage
FROM node:20-alpine3.20 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT=3000

CMD [ "node", "server.js" ]