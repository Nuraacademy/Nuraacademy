# Course Assignment View

The Assignment page (`/classes/[id]/course/[id]/assignment`) is where students view and work on specific course projects or tasks.

## Features
- **Assignment Details**: Displays title, description, and key dates (start/end).
- **Submission Portal**: Provides access to work on and submit the assignment.

## Backend Integration
- **Server Component**: Fetches assignment details linked to the course.
- **Controller**: Uses `assessmentController.getAssignmentDetails`.
- **Submission**: Interfaces with `submitAssignment` server action for recording work/file uploads.
