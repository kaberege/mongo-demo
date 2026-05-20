# Stage 1: Install production dependencies only
# This stage's node_modules will be copied to the final image
FROM node:26-alpine3.22 AS deps
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev

# Stage 2: Build the application
# This stage has full devDependencies for TypeScript, etc.
FROM node:26-alpine3.22 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci                   
COPY . .
RUN npm run build

# Stage 3: Production image (this is what gets deployed)
# Only contains the runtime - no build tools, no source code
FROM node:26-alpine3.22 AS production
WORKDIR /app

# Security: Create non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cherry-pick only what's needed from previous stages
# Prod deps only
COPY --from=deps /app/node_modules ./node_modules 
# Compiled output 
COPY --from=build /app/build ./build
# For metadata                 
COPY --from=build /app/package.json ./              

# Set ownership and switch to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8000
CMD ["npm", "start"]
