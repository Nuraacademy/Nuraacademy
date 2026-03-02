# Presence & SES View

The Presence page (`/classes/[id]/course/[id]/session/[id]/presence`) is a dashboard for tracking learner attendance and engagement (Student Evaluation of Session).

## Features
- **Learner List**: Displays all students enrolled in the class.
- **Attendance Tracking**: Shows "Attend" or "Absent" status based on database records.
- **SES Score**: Placeholder for student evaluation metrics (derived or recorded).

## Backend Integration
- **Server Component**: Fetches session details, course, class, and the list of enrolled learners.
- **Controller**: Uses `enrollmentController.getEnrolledLearners` and `courseController.getSessionDetails`.
- **Submission**: Integrates with `markPresence` server action (partial implementation for individual marking).
