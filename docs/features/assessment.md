# Feature: Assessment

The assessment system manages placement tests, pre-tests, post-tests, and assignments.

## Data Model
- **PlacementTest**: Class-level test with Objective, Essay, and Project questions.
- **PreTest/PostTest**: Session-level quizzes.
- **Assignment**: Homework or group projects.
- **TestSubmission**: Tracks student attempts and answers.

## Controller: `assessmentController.ts`
- `getPlacementTest(classId)`: Fetches questions and test metadata.
- `submitPlacementTest(data)`: Saves student answers to the database.
- `getAssignmentsByCourse(courseId)`: Lists all course assignments.
- `submitAssignment(data)`: Handles file URLs and student notes.

## Integration
- **Placement Test**: Found at `/classes/[id]/test`. Uses `TestRunner` component.
- **Course Assignment**: Found at `/classes/[id]/course/[course_id]/assignment`.

---
[Back to README](../README.md)
