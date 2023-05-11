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

