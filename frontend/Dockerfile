# Dockerfile for trash-ai frontend

# Stage 1: Build the project
FROM node:16.12.0 as builder

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Stage 2: Serve the built project with Nginx
FROM nginx:1.23.3

# Copy the built project from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# This Dockerfile starts with the official Node.js 14 Alpine image as the base image. It sets the working directory to `/app`, copies the `package.json` and `yarn.lock` files to the container, and installs the dependencies using Yarn.
# Next, it copies the rest of the application code to the container and builds the application using Vite. It exposes port 3000 for the application and starts the application using the production build.