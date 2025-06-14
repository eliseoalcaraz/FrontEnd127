# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Set the environment variable for the backend API URL for the BUILD stage.
# This ensures it's available when 'npm run build' executes and next.config.ts is processed.
ENV NEXT_PUBLIC_BACKEND_URL=http://backend:5000

# Copy package.json and yarn.lock/package-lock.json first to leverage Docker cache
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Next.js application
# The output is in the .next directory
RUN npm run build

# Stage 2: Run the Next.js application
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set the environment variable for the backend API URL for the RUN stage.
# This ensures it's available when the Next.js server actually runs.
ENV NEXT_PUBLIC_BACKEND_URL=http://backend:5000

EXPOSE 3000

# Command to run the Next.js application in production mode
CMD ["npm", "run", "dev"]
