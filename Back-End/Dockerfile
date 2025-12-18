FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules (bcrypt) and wget for health checks
RUN apk add --no-cache python3 make g++ wget

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8080

# Start the application with auto-initialization
CMD ["/app/start.sh"]

