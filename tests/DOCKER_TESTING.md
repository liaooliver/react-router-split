# Docker Testing Guide

This document provides comprehensive testing strategies and procedures for the Docker setup of the react-router-split application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Testing](#automated-testing)
3. [Manual Testing](#manual-testing)
4. [Security Testing](#security-testing)
5. [Performance Testing](#performance-testing)
6. [CI/CD Integration](#cicd-integration)

## Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- bash shell (for automated tests)
- curl (for API testing)

### Running Automated Tests

```bash
# Run the Docker test suite
./tests/docker-test.sh
```

## Automated Testing

### Test Suite Overview

The automated test suite (`tests/docker-test.sh`) performs the following checks:

1. **File Existence Checks**
   - Validates Dockerfile exists
   - Checks for .dockerignore file

2. **Build Tests**
   - Builds Docker image
   - Verifies build success
   - Checks image size

3. **Image Inspection**
   - Counts image layers
   - Checks user configuration
   - Validates exposed ports

4. **Runtime Tests**
   - Starts container
   - Verifies container is running
   - Tests application response
   - Checks container logs

5. **Security Checks**
   - Scans for unnecessary files
   - Runs vulnerability scan (if Trivy available)

### Running Individual Test Categories

```bash
# Build test only
docker build -t react-router-split-test .

# Runtime test only
docker run -d --name test-container -p 3001:3000 react-router-split-test
sleep 10
curl http://localhost:3001

# Cleanup
docker stop test-container
docker rm test-container
docker rmi react-router-split-test
```

## Manual Testing

### 1. Build Testing

```bash
# Standard build
docker build -t react-router-split .

# Build with no cache (clean build)
docker build --no-cache -t react-router-split .

# Build with progress output
docker build --progress=plain -t react-router-split .

# Build with build arguments
docker build \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VERSION=1.0.0 \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  -t react-router-split .
```

### 2. Image Inspection

```bash
# View image details
docker images react-router-split

# Inspect image configuration
docker inspect react-router-split

# View image history and layers
docker history react-router-split

# Check image size per layer
docker history react-router-split --human --format "{{.Size}}\t{{.CreatedBy}}"
```

### 3. Container Testing

```bash
# Run container
docker run -d --name my-app -p 3000:3000 react-router-split

# Check if container is running
docker ps

# View container logs
docker logs my-app

# Follow logs in real-time
docker logs -f my-app

# Execute shell in running container
docker exec -it my-app sh

# Check container resource usage
docker stats my-app

# Inspect container details
docker inspect my-app
```

### 4. Application Testing

```bash
# Test HTTP response
curl -I http://localhost:3000

# Get full response
curl http://localhost:3000

# Test with timeout
curl --max-time 5 http://localhost:3000

# Save response to file
curl -o response.html http://localhost:3000
```

### 5. Network Testing

```bash
# List container networks
docker network ls

# Inspect network
docker network inspect bridge

# Test container connectivity
docker exec my-app ping -c 4 google.com
```

## Security Testing

### 1. Vulnerability Scanning with Trivy

```bash
# Install Trivy
# macOS: brew install aquasecurity/trivy/trivy
# Linux: wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
# or visit: https://aquasecurity.github.io/trivy/

# Scan image for vulnerabilities
trivy image react-router-split

# Scan with severity filter
trivy image --severity HIGH,CRITICAL react-router-split

# Generate report
trivy image --format json --output trivy-report.json react-router-split
```

### 2. Docker Bench Security

```bash
# Run Docker Bench Security
docker run -it --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/lib/systemd:/usr/lib/systemd \
  -v /etc:/etc --label docker_bench_security \
  docker/docker-bench-security
```

### 3. Manual Security Checks

```bash
# Check if running as root
docker exec my-app whoami

# Check file permissions
docker exec my-app ls -la /app

# Verify no sensitive files in image
docker run --rm react-router-split ls -la /app

# Check for secrets
docker history react-router-split --no-trunc | grep -i "secret\|password\|key"
```

## Performance Testing

### 1. Build Performance

```bash
# Measure build time
time docker build -t react-router-split .

# Use BuildKit for better performance
DOCKER_BUILDKIT=1 docker build -t react-router-split .

# Build with layer caching
docker build -t react-router-split .  # First build
# Make a small change
docker build -t react-router-split .  # Should be faster
```

### 2. Runtime Performance

```bash
# Monitor container resources
docker stats my-app

# Check container startup time
time docker run -d --name my-app -p 3000:3000 react-router-split

# Memory usage
docker stats --no-stream my-app --format "{{.MemUsage}}"

# CPU usage
docker stats --no-stream my-app --format "{{.CPUPerc}}"
```

### 3. Load Testing

```bash
# Install Apache Bench (if not available)
# macOS: brew install httpd (includes ab)
# Linux: sudo apt-get install apache2-utils

# Simple load test
ab -n 1000 -c 10 http://localhost:3000/

# With keep-alive
ab -k -n 1000 -c 10 http://localhost:3000/
```

### 4. Image Size Optimization

```bash
# Compare with dive tool
# Install: https://github.com/wagoodman/dive
dive react-router-split

# Check for wasted space
docker images react-router-split --format "{{.Repository}}:{{.Tag}} {{.Size}}"
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker-test.yml`:

```yaml
name: Docker Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  docker-test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Build Docker image
      run: |
        docker build \
          --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
          --build-arg VERSION=${{ github.ref_name }} \
          --build-arg VCS_REF=${{ github.sha }} \
          -t react-router-split:test \
          .
    
    - name: Test container
      run: |
        docker run -d --name test-container -p 3000:3000 react-router-split:test
        sleep 15
        curl --fail http://localhost:3000 || exit 1
        docker logs test-container
        docker stop test-container
    
    - name: Run Trivy security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'react-router-split:test'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy results
      uses: github/codeql-action/upload-sarif@v3
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - security

docker-build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker save $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA > image.tar
  artifacts:
    paths:
      - image.tar

docker-test:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  dependencies:
    - docker-build
  script:
    - docker load < image.tar
    - docker run -d --name test-app -p 3000:3000 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - sleep 15
    - apk add --no-cache curl
    - curl --fail http://localhost:3000
    - docker logs test-app

security-scan:
  stage: security
  image: aquasec/trivy:latest
  dependencies:
    - docker-build
  script:
    - docker load < image.tar
    - trivy image --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Test Checklist

Use this checklist before deploying:

### Pre-Build
- [ ] Dockerfile exists and is valid
- [ ] .dockerignore exists and excludes unnecessary files
- [ ] Build dependencies are up to date

### Build Phase
- [ ] Image builds successfully
- [ ] No build errors or warnings
- [ ] Build time is acceptable
- [ ] Image size is reasonable

### Image Inspection
- [ ] Image layers are optimized
- [ ] No sensitive data in image
- [ ] Proper user configuration (non-root if required)
- [ ] Correct ports are exposed

### Runtime Tests
- [ ] Container starts successfully
- [ ] Application responds on expected port
- [ ] No errors in container logs
- [ ] Container passes health checks

### Security
- [ ] No critical vulnerabilities
- [ ] No secrets in image
- [ ] Running as non-root user (if implemented)
- [ ] Minimal attack surface

### Performance
- [ ] Acceptable startup time
- [ ] Reasonable memory usage
- [ ] Good response time under load

## Troubleshooting

### Build Failures

```bash
# Check build logs
docker build --progress=plain -t react-router-split . 2>&1 | tee build.log

# Build without cache
docker build --no-cache -t react-router-split .

# Check available disk space
df -h
```

### Container Won't Start

```bash
# Check container logs
docker logs <container-name>

# Run container in foreground
docker run --rm -it -p 3000:3000 react-router-split

# Override entrypoint to debug
docker run --rm -it --entrypoint sh react-router-split
```

### Application Not Responding

```bash
# Check if port is exposed
docker port <container-name>

# Check container network
docker inspect <container-name> | grep IPAddress

# Test from within container
docker exec <container-name> wget -O- http://localhost:3000
```

### High Resource Usage

```bash
# Check resource limits
docker inspect <container-name> | grep -A 10 Resources

# Monitor in real-time
docker stats <container-name>

# Check for memory leaks
docker exec <container-name> top
```

## Best Practices

1. **Always test locally before pushing**
   ```bash
   ./tests/docker-test.sh
   ```

2. **Use multi-stage builds** to minimize image size

3. **Implement health checks** for production containers

4. **Run security scans regularly**
   ```bash
   trivy image --severity HIGH,CRITICAL react-router-split
   ```

5. **Monitor container logs** in production

6. **Use specific version tags** instead of `latest`

7. **Document all environment variables** needed

8. **Test with production-like data** when possible

## Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Docker logs: `docker logs <container-name>`
3. Review build logs: `docker build --progress=plain`
4. Open an issue in the repository
