# Use Node.js 18 as the base image for building
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the built React app
FROM nginx:alpine

# Copy the built app to nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]