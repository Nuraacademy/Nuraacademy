# Page: Course Overview

**Path**: `/src/app/classes/[id]/overview/page.tsx`

## Features
- Hero banner with class duration and schedule.
- Timeline of the learning journey.
- "What You Will Learn" checklist.
- List of courses within the class.
- Placement Test entry point.

## Backend Integration
- **Details**: Fetched using `classController.getClassDetails(id)`.
- **Enrollment**: Checks `enrollmentController.getEnrollmentStatus()` to toggle the "Enroll" button.
- **Courses**: Displays `courseController.getCoursesByClass(id)`.

---
[Back to README](../README.md)
