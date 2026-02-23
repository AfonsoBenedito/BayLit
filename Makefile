.PHONY: run-docker stop-docker run-backend run-frontend stop-backend stop-frontend \
        lint lint-frontend build-check build-check-frontend

# ── Docker ────────────────────────────────────────────────────────────────────

run-docker:
	docker compose up --build -d

stop-docker:
	docker compose down

# ── Local dev (Node.js backend + React frontend) ──────────────────────────────

run-backend:
	cd Back-End && npm start

run-frontend:
	cd Front-End/projeto-baylit && npm start

stop-backend:
	@pkill -f "node api/index_test.js" 2>/dev/null || echo "No backend process found"

stop-frontend:
	@pkill -f "react-scripts start" 2>/dev/null || echo "No frontend process found"

# ── Lint ──────────────────────────────────────────────────────────────────────

lint: lint-frontend

lint-frontend:
	cd Front-End/projeto-baylit && npx eslint src --ext .js,.jsx

# ── Build check ───────────────────────────────────────────────────────────────

build-check: build-check-frontend

build-check-frontend:
	cd Front-End/projeto-baylit && REACT_APP_API_URL=/api npm run build
