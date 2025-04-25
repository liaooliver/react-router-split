# ----------- Build Stage -----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----------- Production Stage -----------
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
# 如果有 server 端 index.js 也一併複製
COPY --from=builder /app/build/server ./build/server

EXPOSE 3000
CMD ["npm", "run", "start"]