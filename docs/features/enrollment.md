# Feature: Enrollment

The enrollment process allows learners to join a class and provide their professional background.

## Data Model
- **Enrollment**: Links a `User` to a `Class`. Stores profession, YoE, work field, education field, job industry, and final expectations.
- **EnrollmentLearningObjective**: Stores specific objectives for the enrollment (e.g., Career switch, Upskilling).

## Controller: `src/controllers/enrollmentController.ts`
- `createEnrollment(data)`: Creates a new enrollment record with associated objectives.
- `getEnrollmentStatus(userId, classId)`: Checks if a user is already enrolled in a specific class.

## Workflow
1. User navigates to a class overview page.
2. If not enrolled, the "Enroll Now" button is visible.
3. User fills out the enrollment form at `/classes/[id]/enrollment`.
4. Form submission calls `createEnrollment` and displays a welcoming modal with the next steps (Placement Test, etc.).

---
[Back to README](../README.md)
