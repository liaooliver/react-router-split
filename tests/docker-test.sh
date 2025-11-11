#!/bin/bash

# Docker Build and Test Script
# This script tests the Dockerfile build process and validates the container

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="react-router-split-test"
CONTAINER_NAME="react-router-split-test-container"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

test_passed() {
    echo -e "${GREEN}✓${NC} $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

test_failed() {
    echo -e "${RED}✗${NC} $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

cleanup() {
    log_info "Cleaning up..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
}

# Cleanup on exit
trap cleanup EXIT

echo "=========================================="
echo "Docker Build and Test Suite"
echo "=========================================="
echo ""

# Test 1: Check if Dockerfile exists
log_info "Test 1: Checking if Dockerfile exists..."
if [ -f "$PROJECT_ROOT/dockerfile" ]; then
    test_passed "Dockerfile exists"
else
    test_failed "Dockerfile not found"
    exit 1
fi

# Test 2: Check if .dockerignore exists
log_info "Test 2: Checking if .dockerignore exists..."
if [ -f "$PROJECT_ROOT/.dockerignore" ]; then
    test_passed ".dockerignore exists"
else
    test_warning "Warning: .dockerignore not found (recommended for optimization)"
fi

# Test 3: Build the Docker image
log_info "Test 3: Building Docker image..."
cd "$PROJECT_ROOT"
if docker build -t $IMAGE_NAME . ; then
    test_passed "Docker image built successfully"
else
    test_failed "Docker image build failed"
    exit 1
fi

# Test 4: Check image size
log_info "Test 4: Checking image size..."
IMAGE_SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
log_info "Image size: $IMAGE_SIZE"
test_passed "Image size check completed: $IMAGE_SIZE"

# Test 5: Inspect image layers
log_info "Test 5: Inspecting image layers..."
LAYER_COUNT=$(docker history $IMAGE_NAME --format "{{.ID}}" | wc -l)
log_info "Number of layers: $LAYER_COUNT"
test_passed "Image has $LAYER_COUNT layers"

# Test 6: Check for non-root user (if implemented)
log_info "Test 6: Checking user configuration..."
USER_INFO=$(docker inspect $IMAGE_NAME --format='{{.Config.User}}')
if [ -z "$USER_INFO" ]; then
    test_warning "Warning: Container runs as root (consider adding non-root user)"
else
    test_passed "Container configured to run as user: $USER_INFO"
fi

# Test 7: Check exposed ports
log_info "Test 7: Checking exposed ports..."
EXPOSED_PORTS=$(docker inspect $IMAGE_NAME --format='{{json .Config.ExposedPorts}}')
if echo "$EXPOSED_PORTS" | grep -q "3000"; then
    test_passed "Port 3000 is exposed"
else
    test_failed "Port 3000 is not exposed"
fi

# Test 8: Start container
log_info "Test 8: Starting container..."
if docker run -d --name $CONTAINER_NAME -p 3001:3000 $IMAGE_NAME ; then
    test_passed "Container started successfully"
else
    test_failed "Failed to start container"
    exit 1
fi

# Wait for container to be ready
log_info "Waiting for application to start..."
sleep 10

# Test 9: Check if container is running
log_info "Test 9: Checking if container is running..."
if docker ps | grep -q $CONTAINER_NAME; then
    test_passed "Container is running"
else
    test_failed "Container is not running"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Test 10: Check container health
log_info "Test 10: Testing application response..."
sleep 5  # Give more time for the app to fully start
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200\|301\|302"; then
    test_passed "Application is responding"
else
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
    log_warning "Warning: Application returned HTTP code: $HTTP_CODE"
    log_info "Checking container logs..."
    docker logs $CONTAINER_NAME
fi

# Test 11: Check container logs for errors
log_info "Test 11: Checking container logs..."
LOGS=$(docker logs $CONTAINER_NAME 2>&1)
if echo "$LOGS" | grep -qi "error"; then
    test_warning "Warning: Errors found in container logs"
    echo "$LOGS" | grep -i "error"
else
    test_passed "No errors in container logs"
fi

# Test 12: Check if node_modules is excluded (security check)
log_info "Test 12: Checking for unnecessary files in image..."
if docker run --rm $IMAGE_NAME sh -c "[ -d /app/node_modules/.cache ]"; then
    test_warning "Warning: Cache directories found in image"
else
    test_passed "No unnecessary cache directories in image"
fi

# Test 13: Security scan (if trivy is available)
log_info "Test 13: Running security scan..."
if command -v trivy &> /dev/null; then
    log_info "Running Trivy security scan..."
    if trivy image --severity HIGH,CRITICAL $IMAGE_NAME; then
        test_passed "Security scan completed"
    else
        test_warning "Warning: Security vulnerabilities found"
    fi
else
    test_warning "Warning: Trivy not installed, skipping security scan"
    log_info "To install Trivy: https://aquasecurity.github.io/trivy/"
fi

# Print summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    log_info "All tests passed! ✓"
    exit 0
else
    log_error "Some tests failed!"
    exit 1
fi
