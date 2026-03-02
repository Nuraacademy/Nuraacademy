# Feature: Authentication

Nura Academy uses a simple email-based authentication system.

## Data Model
- **User**: Stores email, name, and role (LEARNER, TRAINER, ADMIN).

## Controller: `src/controllers/authController.ts`
- `registerUser(data)`: Uses `upsert` to create or update a user by email.
- `getUserProfile(email)`: Fetches user details including enrollments and group memberships.

## Implementation Details
- Currently, the system supports a "Magic Link" or simple form-based registration.
- In production, it is recommended to integrate with NextAuth.js or a similar provider using the `PrismaAdapter`.

---
[Back to README](../README.md)
