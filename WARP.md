# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API project designed as part of a complete DevOps pipeline tutorial. The project implements a user authentication system with PostgreSQL database (via Neon), and is structured to eventually include Docker, Kubernetes, and GitHub Actions deployment.

## Development Commands

### Core Development
- `npm run dev` - Start development server with file watching
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check Prettier formatting

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio for database inspection

## Architecture

### Project Structure
The application follows a modular architecture with clear separation of concerns:

- **Entry Point**: `src/index.js` loads environment and starts `src/server.js`
- **Application**: `src/app.js` contains Express app configuration and middleware setup
- **Database**: Uses Drizzle ORM with Neon PostgreSQL serverless database
- **Authentication**: JWT-based auth with bcrypt password hashing and HTTP-only cookies

### Import Path Mapping
The project uses Node.js import maps for clean module resolution:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middlewares/*` → `./src/middlewares/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Database Schema
Currently implements a single `users` table with:
- Standard user fields (name, email, password)
- Role-based access (user/admin)
- Timestamps for audit trail

### Validation & Security
- **Input Validation**: Zod schemas for request validation
- **Security Middleware**: Helmet for security headers, CORS configuration
- **Authentication**: JWT tokens with secure cookie storage
- **Logging**: Winston logger with Morgan for HTTP request logging

### API Endpoints
- Health check: `GET /health`
- Authentication routes: `/api/auth/*`
  - User registration with validation and password hashing
  - JWT token generation and cookie management

## Development Guidelines

### When Adding New Features
1. Create appropriate validation schemas in `src/validations/`
2. Implement business logic in `src/services/`
3. Create controllers in `src/controllers/`
4. Define routes in `src/routes/`
5. Update database models in `src/models/` if needed
6. Run `npm run db:generate` and `npm run db:migrate` for schema changes

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode
- `LOG_LEVEL` - Winston logging level

### Code Quality
The project enforces code quality through:
- ESLint with Prettier integration
- Import path validation using the defined aliases
- Consistent error handling and logging patterns