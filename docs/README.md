# Nura Academy Backend Documentation

Welcome to the backend documentation for Nura Academy. This documentation covers the architecture, features, and page-specific implementations.

## Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Aiven)
- **ORM**: Prisma 7
- **Language**: TypeScript
- **Runtime**: Bun

## Architecture
The application follows a simplified MVC-like pattern within the Next.js App Router:
- **Models**: Defined in `prisma/schema.prisma`.
- **Controllers**: Business logic residing in `src/controllers/`. These handle database operations using Prisma.
- **Views**: React components in `src/app/` and `src/components/`.
- **Data Fetching**: Server Components calling controllers directly or Client Components using Server Actions/APIs.

## Directory Structure
- `prisma/`: Database schema, migrations, and seed scripts.
- `src/controllers/`: Business logic for various entities.
- `src/lib/prisma.ts`: Prisma Client singleton with SSL configuration.
- `docs/`: Comprehensive documentation.
    - [Session View](pages/session_view.md)
    - [Pre/Post Test View](pages/pre_post_test_view.md)
    - [Exercise View](pages/exercise_view.md)
    - [Presence & SES View](pages/presence_view.md)
    - [Course Assignment View](pages/assignment_view.md)
    - [View Groups](pages/groups_view.md)
    - [Session Recording View](pages/recording_view.md)
    - [Discussion Forum](pages/forum_view.md)

---
[Next: Feature Overview](./features/README.md)
