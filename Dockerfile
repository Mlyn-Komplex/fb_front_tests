# Stage 1: Build the app
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.* ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
# If you use react-router, you need to handle SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
