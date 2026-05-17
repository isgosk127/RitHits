FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads/songs uploads/covers uploads/streaming

# Expose the application port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:prod"]
