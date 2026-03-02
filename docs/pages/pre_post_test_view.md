# Pre/Post Test View

The Pre/Post Test pages (`/classes/[id]/course/[id]/session/[id]/pre-test` or `post-test`) provide interactive assessments for students to evaluate their knowledge before and after a session.

## Features
- **Timed Assessments**: Integrates with `TestRunner` to provide a timed testing experience.
- **Dynamic Questions**: Fetches objective questions from the database based on the session ID.
- **Intro Screen**: Shows test details (start/end dates, instructions) before starting.

## Backend Integration
- **Server Component**: Fetches session, course, class, and test details from the database.
- **Controller**: Uses `assessmentController.getPreTest` or `getPostTest`.
- **Client Component**: `PreTestClient` and `PostTestClient` manage the transition from intro screen to the active `TestRunner`.
- **Submission**: Uses `submitTestAction` (Server Action) to save answers to the database.
