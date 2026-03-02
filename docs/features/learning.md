# Feature: Learning & Resources

This module handles the core educational content delivery.

## Data Model
- **Course**: A collection of learning modules within a class.
- **Session**: Individual learning units (Asynchronous Video, Synchronous Zoom, or Assignment).
- **ReferenceMaterial**: PDF/CSV files attached to a session.

## Controller: `courseController.ts`
- `getCoursesByClass(classId)`: Lists all courses for a class.
- `getSessionDetails(id)`: Fetches video URLs, Zoom links, and materials.
- `markPresence(sessionId, userId)`: Tracks student attendance for synchronous sessions.

## Integration
- **Course List**: Found in the class overview.
- **Session Page**: `/classes/[id]/course/[course_id]/session/[module_id]`.
- **Presence**: Linked from synchronous session views.

---
[Back to README](../README.md)
