# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build Next.js app
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-slim AS runner
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
