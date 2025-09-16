# Use Node.js 16 as base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5003

# Start the application
CMD ["npm", "start"]