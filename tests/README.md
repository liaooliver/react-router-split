# Docker Tests

This directory contains comprehensive testing resources for the Docker setup of react-router-split.

## Contents

- **docker-test.sh**: Automated test script for Docker build and runtime validation
- **DOCKER_TESTING.md**: Complete guide for testing Docker containers

## Quick Start

### Run All Tests

```bash
# Make the script executable (if not already)
chmod +x docker-test.sh

# Run the test suite
./docker-test.sh
```

### What Gets Tested

The automated test suite validates:

1. ✅ Dockerfile exists
2. ✅ .dockerignore exists (recommended)
3. ✅ Docker image builds successfully
4. ✅ Image size is reasonable
5. ✅ Image layers are optimized
6. ✅ User configuration (security check)
7. ✅ Ports are properly exposed
8. ✅ Container starts successfully
9. ✅ Container runs without crashing
10. ✅ Application responds to requests
11. ✅ No errors in container logs
12. ✅ No unnecessary files in image
13. ✅ Security vulnerabilities (if Trivy installed)

## Test Output

Successful test output looks like:

```
==========================================
Docker Build and Test Suite
==========================================

[INFO] Test 1: Checking if Dockerfile exists...
✓ Dockerfile exists
[INFO] Test 2: Checking if .dockerignore exists...
✓ .dockerignore exists
[INFO] Test 3: Building Docker image...
✓ Docker image built successfully
...
==========================================
Test Summary
==========================================
Passed: 13
Failed: 0

[INFO] All tests passed! ✓
```

## Manual Testing

For detailed manual testing procedures, see [DOCKER_TESTING.md](./DOCKER_TESTING.md)

## CI/CD Integration

The Docker tests are also integrated into GitHub Actions. See `.github/workflows/docker-test.yml` for the CI configuration.

## Prerequisites

- Docker Engine 20.10+
- bash shell
- curl (for HTTP testing)
- (Optional) Trivy for security scanning

## Troubleshooting

If tests fail:

1. **Check Docker is running**: `docker ps`
2. **Check disk space**: `df -h`
3. **Review error messages** in the test output
4. **Check container logs**: `docker logs <container-name>`
5. **Try building manually**: `docker build -t test .`

For more detailed troubleshooting, see the [DOCKER_TESTING.md](./DOCKER_TESTING.md) guide.
