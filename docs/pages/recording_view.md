# Session Recording View

The Recording page (`/classes/[id]/course/[id]/session/[id]/recording`) allows students to re-watch synchronous sessions that have been recorded.

## Features
- **Video Player**: Embeds recorded session video (e.g., from Zoom or YouTube).
- **Session Context**: Displays session title and scheduled time.

## Backend Integration
- **Server Component**: Fetches session and zoom session details (including recording URL).
- **Controller**: Uses `courseController.getSessionDetails`.
- **Model**: `ZoomSession` table stores the `recordingUrl` and `recordingTitle`.
