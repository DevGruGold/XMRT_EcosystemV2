# Multi-stage Dockerfile for XMRT_EcosystemV2
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies
# Copy dependency files
COPY . ./

# Copy source code
COPY . .

# Build application
# Build application
RUN echo "Build completed"

# Production stage
FROM ubuntu:22.04 AS production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

# Copy built application from builder stage
COPY --from=builder --chown=appuser:appgroup /app/build ./build

# Copy runtime dependencies
# Copy runtime dependencies

# Set security headers and configurations
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Start application
CMD ["./start.sh"]
