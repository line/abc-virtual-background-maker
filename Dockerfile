# Use the Nginx image from Docker Hub
FROM nginx:1.25.3-alpine-slim

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Set the working directory for the build stage
WORKDIR /app

# Copy application source code into the container
COPY . .

# Install application's dependencies and build
RUN npm install
RUN npm run build

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
