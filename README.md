# OMS SaaS - Inventory Management System

A comprehensive multi-tenant Inventory & Order Management System.

## Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis
- Docker Desktop (Optional, for containerized run)

## Quick Start (Development)

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup Environment Variables:**
    - `apps/api/.env` is already configured with defaults:
      ```env
      DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oms_db?schema=public"
      REDIS_URL="redis://localhost:6379"
      PORT=4000
      CORS_ORIGIN="http://localhost:3000"
      ```
    - Ensure your local PostgreSQL and Redis are running and match these credentials.

3.  **Database Setup:**
    ```bash
    # Run migrations
    npm run db:migrate

    # Seed database (optional/if available)
    npm run db:seed
    ```

4.  **Run Application:**
    ```bash
    npm run dev
    ```
    - **Frontend:** http://localhost:3000
    - **Backend:** http://localhost:4000

## Production / Docker Run

1.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This will start PostgreSQL, Redis, API, and Web containers automatically.

2.  **Build Manually:**
    ```bash
    npm run build
    npm run start --workspace=apps/api
    npm run start --workspace=apps/web
    ```

## Features & Hardening
- **Security**: RBAC, Encrypted API Keys, Helmet, Rate Limiting.
- **Reliability**: Queue Retries (BullMQ), Redis-backed Socket.io.
- **Observability**: Structured Login (Winston), Correlation IDs.
