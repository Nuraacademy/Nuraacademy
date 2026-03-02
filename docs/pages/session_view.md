# Page: Session & Learning

**Path**: `/src/app/classes/[id]/course/[course_id]/session/[module_id]/page.tsx`

## Features
- Dynamic layout based on session type (Video, Zoom, Assignment).
- Video player for asynchronous sessions.
- Zoom link and recording viewer for synchronous sessions.
- Presence/Attendance logging.
- Reference material list (PDF/CSV downloads).

## Backend Integration
- **Details**: Fetched using `courseController.getSessionDetails(id)`.
- **Presence**: Calls `courseController.markPresence()` when a synchronous session is accessed.

---
[Back to README](../README.md)
