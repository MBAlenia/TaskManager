# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install dependencies
# Use npm install instead of npm ci if package-lock.json is not available
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Command to run the application
CMD ["node", "index.js"]