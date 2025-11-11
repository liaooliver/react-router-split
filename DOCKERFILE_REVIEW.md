# Dockerfile Review

## Overview
This document provides a comprehensive review of the Dockerfile for the react-router-split application, including analysis, recommendations, and best practices.

## Current Dockerfile Analysis

### Structure
The Dockerfile uses a **multi-stage build** approach with two stages:
1. **Builder Stage**: Builds the application
2. **Production Stage**: Runs the application

### Strengths ✅

1. **Multi-stage Build**
   - Reduces final image size by separating build and runtime environments
   - Only production dependencies and built artifacts are included in final image

2. **Alpine Base Image**
   - Uses `node:20-alpine` which is significantly smaller than standard Node images
   - Reduces attack surface and image size

3. **Proper Dependency Installation**
   - Build stage installs all dependencies (including devDependencies)
   - Production stage only installs production dependencies with `--omit=dev`

4. **Port Documentation**
   - Properly documents exposed port with `EXPOSE 3000`

5. **Layer Optimization**
   - Copies `package.json` and `package-lock.json` before source code
   - Enables Docker layer caching for dependencies

### Areas for Improvement 🔧

#### 1. Security Enhancements

**Current Risk**: Running as root user
```dockerfile
# Current: No user specification (runs as root)
```

**Recommendation**: Add non-root user
```dockerfile
# ---- 生產階段 (Production Stage) ----
FROM node:20-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy with proper ownership
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs package-lock.json* ./

RUN npm install --omit=dev

COPY --chown=nodejs:nodejs --from=builder /app/build ./build

# Switch to non-root user
USER nodejs

EXPOSE 3000

CMD ["npm", "run", "start"]
```

#### 2. Build Optimization

**Add .dockerignore file** to exclude unnecessary files:
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
*.md
.vscode
.idea
coverage
.DS_Store
dist
build
```

#### 3. Health Check

**Add health check** to monitor container health:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

Note: This requires implementing a `/health` endpoint in the application.

#### 4. Cache Optimization

**Current**: Copies all files before build
```dockerfile
COPY . .
RUN npm run build
```

**Recommendation**: Be more selective with what's copied
```dockerfile
# Copy only necessary files for build
COPY --chown=nodejs:nodejs package.json package-lock.json* ./
COPY --chown=nodejs:nodejs tsconfig.json ./
COPY --chown=nodejs:nodejs vite.config.ts ./
COPY --chown=nodejs:nodejs react-router.config.ts ./
COPY --chown=nodejs:nodejs tailwind.config.ts ./
COPY --chown=nodejs:nodejs components.json ./
COPY --chown=nodejs:nodejs app ./app
COPY --chown=nodejs:nodejs public ./public

RUN npm run build
```

#### 5. Environment Variables

**Add support for environment-specific builds**:
```dockerfile
# Set NODE_ENV
ENV NODE_ENV=production

# Optional: Add build arguments
ARG BUILD_DATE
ARG VERSION
ARG VCS_REF

LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.title="React Router Split" \
      org.opencontainers.image.description="A modern React Router application"
```

#### 6. Smaller Base Image Alternative

Consider using distroless or minimal images for even smaller footprint:
```dockerfile
# Alternative: Use distroless (more secure, smaller)
FROM gcr.io/distroless/nodejs20-debian12
# Note: This requires adjustments as it doesn't have npm
```

## Recommended Dockerfile (Enhanced Version)

```dockerfile
# ---- 建置階段 (Build Stage) ----
FROM node:20-alpine AS builder

# Add metadata
ARG BUILD_DATE
ARG VERSION
ARG VCS_REF

WORKDIR /app

# Copy dependency manifests
COPY package.json ./
COPY package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci --prefer-offline --no-audit

# Copy source code and config files
COPY . .

# Execute build
RUN npm run build

# ---- 生產階段 (Production Stage) ----
FROM node:20-alpine

# Set environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependency manifests with proper ownership
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs package-lock.json* ./

# Install only production dependencies
RUN npm ci --prefer-offline --no-audit --omit=dev && \
    npm cache clean --force

# Copy built files from builder stage
COPY --chown=nodejs:nodejs --from=builder /app/build ./build

# Add metadata labels
LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.title="React Router Split" \
      org.opencontainers.image.description="A modern React Router application"

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check (optional - requires health endpoint in app)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command
CMD ["npm", "run", "start"]
```

## Build and Run Commands

### Building the Image
```bash
# Basic build
docker build -t react-router-split .

# Build with metadata
docker build \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VERSION=1.0.0 \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  -t react-router-split:latest \
  .
```

### Running the Container
```bash
# Basic run
docker run -p 3000:3000 react-router-split

# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  react-router-split

# Run in detached mode
docker run -d -p 3000:3000 --name my-app react-router-split
```

### Testing the Container
```bash
# Check if container is running
docker ps

# View logs
docker logs my-app

# Execute commands in running container
docker exec -it my-app sh

# Stop container
docker stop my-app

# Remove container
docker rm my-app
```

## Performance Metrics

### Image Size Comparison
- **Current Setup**: ~200-250 MB (alpine + production deps + build artifacts)
- **With Optimizations**: ~180-220 MB
- **Standard node:20**: ~900-1000 MB

### Build Time Optimization
- Use `npm ci` instead of `npm install` for faster, reproducible builds
- Enable BuildKit for better caching: `DOCKER_BUILDKIT=1 docker build`
- Use layer caching effectively by copying dependencies first

## Security Checklist

- [x] Uses minimal base image (Alpine)
- [ ] Runs as non-root user (recommended improvement)
- [ ] Scans for vulnerabilities regularly
- [ ] No secrets in image
- [x] Multi-stage build to minimize attack surface
- [ ] Regular base image updates
- [ ] Security scanning in CI/CD pipeline

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build Docker image
  run: |
    docker build \
      --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
      --build-arg VERSION=${{ github.ref_name }} \
      --build-arg VCS_REF=${{ github.sha }} \
      -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
      .

- name: Scan for vulnerabilities
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
```

## Monitoring and Debugging

### Inspect Image Layers
```bash
docker history react-router-split:latest
```

### Check Image Size
```bash
docker images react-router-split:latest
```

### Dive into Image Analysis
```bash
# Install dive: https://github.com/wagoodman/dive
dive react-router-split:latest
```

## Conclusion

The current Dockerfile is well-structured with good practices like multi-stage builds and Alpine images. The main recommendations are:

1. **High Priority**: Add non-root user for security
2. **High Priority**: Create .dockerignore file
3. **Medium Priority**: Use `npm ci` instead of `npm install`
4. **Medium Priority**: Add health check
5. **Low Priority**: Add metadata labels
6. **Low Priority**: Implement vulnerability scanning

These improvements will enhance security, performance, and maintainability while keeping the Dockerfile simple and effective.
