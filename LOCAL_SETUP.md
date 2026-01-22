# Local Mac Development Setup Guide

This guide will help you set up Reactive Resume to run locally on your Mac with all data stored locally.

## Overview

This setup uses:
- **Docker Compose** for infrastructure services (PostgreSQL, Minio, Chrome)
- **Native Node.js** for running the application
- **Local data storage** - all data persists in Docker volumes on your Mac

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Docker Desktop for Mac**
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify installation: `docker --version`
   - Make sure Docker Desktop is running

2. **Node.js 20 or higher**
   - Check version: `node --version`
   - If not installed, download from: https://nodejs.org/
   - Or install via Homebrew: `brew install node`

3. **pnpm (Package Manager)**
   - Check if installed: `pnpm --version`
   - If not installed: `npm install -g pnpm`
   - Or via Homebrew: `brew install pnpm`

## Step-by-Step Setup

### Step 1: Install Project Dependencies

Navigate to the project root directory and install all dependencies:

```bash
pnpm install
```

This will install all required packages for the project.

### Step 2: Create Environment File

The project requires a `.env` file with environment variables. You have two options:

**Option A: Copy from template (Recommended)**
```bash
cp .env.example .env
```

Then edit `.env` and generate secure secrets:
```bash
# Generate access token secret
openssl rand -hex 32

# Generate refresh token secret
openssl rand -hex 32
```

Replace `your_access_token_secret_here` and `your_refresh_token_secret_here` in `.env` with the generated values.

**Option B: Use the pre-configured .env file**
If a `.env` file already exists with secure secrets, you can use it as-is.

### Step 3: Start Infrastructure Services

Start PostgreSQL, Minio (object storage), and Chrome (for PDF generation) using Docker Compose:

```bash
docker compose -f tools/compose/development.yml --env-file .env -p reactive-resume up -d
```

This command will:
- Start PostgreSQL on port 5432
- Start Minio on ports 9000 (API) and 9001 (Console)
- Start Browserless Chrome on port 8080
- Start Adminer (database management UI) on port 5555

**Verify services are running:**
```bash
docker compose -p reactive-resume ps
```

You should see all services with "Up" status.

**Check service logs if needed:**
```bash
docker compose -p reactive-resume logs
```

### Step 4: Initialize Database

Run Prisma migrations to set up the database schema:

```bash
pnpm prisma:migrate:dev
```

This will:
- Create all necessary database tables
- Set up relationships between tables
- Apply any pending migrations

### Step 5: Start the Application

Start both the frontend and backend servers:

```bash
pnpm dev
```

This will start:
- **Frontend** at: http://localhost:5173
- **Backend API** at: http://localhost:3000

The frontend automatically proxies API requests from `/api` to the backend.

### Step 6: Verify Setup

1. **Check Health Endpoint**
   Open your browser and visit: http://localhost:3000/api/health

   You should see a JSON response like:
   ```json
   {
     "status": "ok",
     "info": {
       "database": { "status": "up" },
       "storage": { "status": "up" },
       "browser": { "status": "up", "version": "Chrome/..." }
     },
     "error": {},
     "details": {
       "database": { "status": "up" },
       "storage": { "status": "up" },
       "browser": { "status": "up", "version": "Chrome/..." }
     }
   }
   ```

2. **Access the Application**
   Open your browser and visit: http://localhost:5173

   You should see the Reactive Resume application.

3. **Access Database Management (Optional)**
   You can access Adminer (database management UI) at: http://localhost:5555
   - System: PostgreSQL
   - Server: postgres
   - Username: postgres
   - Password: postgres
   - Database: postgres

4. **Access Minio Console (Optional)**
   You can access Minio Console at: http://localhost:9001
   - Username: minioadmin
   - Password: minioadmin

## Daily Usage

### Starting the Application

1. **Start Docker services** (if not already running):
   ```bash
   docker compose -f tools/compose/development.yml --env-file .env -p reactive-resume up -d
   ```

2. **Start the application**:
   ```bash
   pnpm dev
   ```

### Stopping the Application

1. **Stop the application**: Press `Ctrl+C` in the terminal running `pnpm dev`

2. **Stop Docker services** (optional - they can run in background):
   ```bash
   docker compose -p reactive-resume down
   ```

   To stop and remove volumes (⚠️ **WARNING**: This deletes all data):
   ```bash
   docker compose -p reactive-resume down -v
   ```

## Data Storage

All data is stored locally on your Mac:

- **Database data**: Stored in Docker volume `reactive-resume_postgres_data`
- **File storage (Minio)**: Stored in Docker volume `reactive-resume_minio_data`

Docker volumes are located at: `~/Library/Containers/com.docker.docker/Data/vms/0/data/`

To backup your data, you can export the Docker volumes or use database dump tools.

## Troubleshooting

### Port Already in Use

If you get errors about ports being in use:

1. **Check what's using the port**:
   ```bash
   lsof -i :5432  # PostgreSQL
   lsof -i :9000  # Minio
   lsof -i :8080  # Chrome
   lsof -i :3000  # Backend
   lsof -i :5173  # Frontend
   ```

2. **Update ports in `.env` file** or stop the conflicting service

### Docker Services Not Starting

1. **Check Docker Desktop is running**
2. **Check Docker logs**:
   ```bash
   docker compose -p reactive-resume logs
   ```
3. **Restart Docker services**:
   ```bash
   docker compose -p reactive-resume down
   docker compose -f tools/compose/development.yml --env-file .env -p reactive-resume up -d
   ```

### Database Connection Issues

1. **Verify PostgreSQL is running**:
   ```bash
   docker compose -p reactive-resume ps postgres
   ```

2. **Check database connection string** in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   ```

3. **Test connection**:
   ```bash
   docker compose -p reactive-resume exec postgres psql -U postgres -d postgres -c "SELECT 1;"
   ```

### Prisma Migration Issues

If migrations fail:

1. **Reset database** (⚠️ **WARNING**: Deletes all data):
   ```bash
   pnpm prisma migrate reset
   ```

2. **Or manually run migrations**:
   ```bash
   pnpm prisma migrate deploy
   ```

### Application Not Starting

1. **Check Node.js version**: Must be 20 or higher
   ```bash
   node --version
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

3. **Check environment variables**:
   ```bash
   cat .env
   ```
   Ensure all required variables are set.

## Useful Commands

### Docker Commands

```bash
# View running services
docker compose -p reactive-resume ps

# View logs
docker compose -p reactive-resume logs

# View logs for specific service
docker compose -p reactive-resume logs postgres
docker compose -p reactive-resume logs minio
docker compose -p reactive-resume logs chrome

# Restart a specific service
docker compose -p reactive-resume restart postgres

# Stop all services
docker compose -p reactive-resume down

# Stop and remove volumes (⚠️ deletes data)
docker compose -p reactive-resume down -v
```

### Database Commands

```bash
# Run migrations
pnpm prisma:migrate:dev

# Generate Prisma client
pnpm prisma:generate

# Open Prisma Studio (database GUI)
pnpm prisma studio
```

### Application Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Next Steps

Once your local setup is running:

1. **Create an account** in the application
2. **Configure OpenAI API key** (optional) in Settings for AI features
3. **Start building your resume!**

## Additional Resources

- [Project README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/AmruthPillai/Reactive-Resume/issues)
2. Review the [Contributing Guide](./CONTRIBUTING.md)
3. Check Docker and service logs for error messages

