# Fullstack Template (Vue 3 + Hono)

A production-ready template for building scalable fullstack applications. This project extracts standard patterns and configurations to streamline the initialization of new projects, featuring a modern tech stack and strict architectural guidelines.

## Tech Stack

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Server State**: [TanStack Query](https://tanstack.com/query/latest) (Vue Query)
- **Icons**: [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Fingerprinting**: [ThumbmarkJS](https://github.com/thumbmarkjs/thumbmarkjs)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Hono](https://hono.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Logging**: [Pino](https://github.com/pinojs/pino)

## Architecture

This project enforces a **Feature-Based Architecture** in both Frontend and Backend to ensure scalability and maintainability.

### Frontend Structure (`Frontend/src/features/`)
Each feature (e.g., `auth`, `users`) is self-contained with its own:
- `components/`: Feature-specific UI components
- `composables/`: Logic and state (TanStack Query hooks)
- `store/`: Client-side state (Pinia)
- `api/`: API service calls
- `routes.ts`: Route definitions

### Backend Structure (`Backend/src/features/`)
Follows a strict separation of concerns:
- `route.ts`: HTTP routes (Hono)
- `controller.ts`: Request/Response handling
- `service.ts`: Business logic
- `data.ts`: Database queries (Prisma)
- `middleware.ts`: Feature-specific middleware

## Getting Started

### Prerequisites
- Docker Desktop

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd fullstack-template
    ```

2.  **Setup Backend**
    ```bash
    cd Backend
    npm install
    cp .env.example .env # Configure your DB_URL
    docker compose -f compose.dev.yaml up -d
    npx prisma migrate dev --name init
    npx prisma generate
    ```

3.  **Setup Frontend**
    ```bash
    cd ../Frontend
    npm install
    cp .env.example .env # Configure VITE_API_URL
    ```

### Running the Project

**Backend Development Server**
```bash
# In Backend directory
docker compose -f compose.dev.yaml watch
```

**Frontend Development Server**
```bash
# In Frontend directory
npm run dev
```

## Key Features

- **Strict TypeScript**: Configured for maximum type safety.
- **Automated Tooling**: ESLint, Prettier, and custom workflows.
- **Secure Auth**: HttpOnly Cookie-based authentication patterns.
- **Error Handling**: Centralized error handling on both client and server.