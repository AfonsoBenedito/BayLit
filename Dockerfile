# Stage 1: Build React frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY Front-End/projeto-baylit/package*.json ./
RUN npm ci --prefer-offline
COPY Front-End/projeto-baylit/ ./
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Build Go binary
FROM golang:1.24-alpine AS backend
WORKDIR /app
COPY api-go/go.mod api-go/go.sum ./
RUN go mod download
COPY api-go/ ./
# Copy React build output into the embedded static dir
COPY --from=frontend /app/build/ ./static/
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /baylit .

# Stage 3: Minimal runtime image
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata wget
WORKDIR /
COPY --from=backend /baylit /baylit
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["/baylit"]
