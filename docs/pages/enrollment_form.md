# Page: Enrollment Form

**Path**: `/src/app/classes/[id]/enrollment/page.tsx`

## Features
- Personal information form (Profession, YoE, Work Field, etc.).
- Multi-select for learning objectives.
- CV upload component.
- Success modal upon submission.

## Backend Integration
- **Submission**: Calls `enrollmentController.createEnrollment(data)` with form values.
- **Upload**: Integrates with a file storage service (logic in enrollmentController).

---
[Back to README](../README.md)
