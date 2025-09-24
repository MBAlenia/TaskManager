# Use Node.js 18 as the base image for building
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install all dependencies including dev dependencies
# Use npm install instead of npm ci if package-lock.json is not available
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the application code
COPY . .

# Build the React app with environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Use nginx to serve the built React app
FROM nginx:alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy the built app to nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]