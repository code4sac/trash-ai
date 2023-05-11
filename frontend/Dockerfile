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

# Show secret length
RUN --mount=type=secret,id=google_api \
  bash -c "echo api key length: $(cat /run/secrets/google_api | wc -c)"

# Build the project
RUN --mount=type=secret,id=google_api \
  bash -c "VITE_GOOGLE_MAPS_API_KEY=$(cat /run/secrets/google_api) yarn build"

# Stage 2: Serve the built project with Nginx
FROM nginx:1.23.3

# Copy the built project from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
