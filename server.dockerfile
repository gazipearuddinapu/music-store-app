FROM node:18-alpine

WORKDIR /app

# Copy and install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/server.js ./server/

# Expose port
EXPOSE 5000

# Start server
WORKDIR /app/server
CMD ["npm", "start"]
