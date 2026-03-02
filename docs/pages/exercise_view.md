# Exercise View

The Exercise page (`/classes/[id]/course/[id]/session/[id]/exercise`) provides practical tasks or external resources for students to practice what they've learned.

## Features
- **Contextual Details**: Shows specific exercise details, instructions, and related module/class info.
- **External Links**: Often integrates with Google Colab or other tools for hands-on practice.

## Backend Integration
- **Server Component**: Fetches exercise details including session, course, and class hierarchy.
- **Controller**: Uses `courseController.getExerciseDetails`.
- **Client Wrapper**: `SidebarWrapper` handles the responsive sidebar state.
