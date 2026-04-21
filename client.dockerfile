FROM node:18-alpine AS builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/src ./src
COPY client/public ./public

ENV REACT_APP_API_URL=/api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built client
COPY --from=builder /app/client/build ./client/build

# Copy server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server
COPY server/server.js ./server/

EXPOSE 5000

CMD ["node", "server/server.js"]
