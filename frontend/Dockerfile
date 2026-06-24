# ── Build Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# You should provide env vars dynamically, but for build time we can copy .env if needed
# COPY .env .env
RUN npm run build

# ── Production Stage ──────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets to Nginx serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Add a custom nginx.conf to handle React Router pushState (fallback to index.html)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
