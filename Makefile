.PHONY: run-docker stop-docker build-static run-go stop-go \
        lint lint-go lint-frontend \
        build-check build-check-go build-check-frontend

# ── Docker ────────────────────────────────────────────────────────────────────

run-docker:
	docker compose up --build

stop-docker:
	docker compose down

# ── Go (local) ────────────────────────────────────────────────────────────────

build-static:
	cd Front-End/projeto-baylit && REACT_APP_API_URL=/api npm run build
	cp -r Front-End/projeto-baylit/build/. api-go/static/

run-go: build-static
	cd api-go && DATABASE_PATH=./baylit.db TOKEN_SECRET=dev-secret go run .

stop-go:
	@pkill -f "go run ." 2>/dev/null || pkill -f "baylit" 2>/dev/null || echo "No Go process found"

# ── Lint ──────────────────────────────────────────────────────────────────────

lint: lint-go lint-frontend

lint-go:
	cd api-go && go vet ./...

lint-frontend:
	cd Front-End/projeto-baylit && npx eslint src --ext .js,.jsx

# ── Build checks ──────────────────────────────────────────────────────────────

build-check: build-check-go build-check-frontend

build-check-go:
	cd api-go && CGO_ENABLED=0 go build ./...

build-check-frontend:
	cd Front-End/projeto-baylit && REACT_APP_API_URL=/api npm run build
