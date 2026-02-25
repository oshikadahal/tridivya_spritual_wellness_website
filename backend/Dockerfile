# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY uploads ./uploads

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "dist/index.js"]
