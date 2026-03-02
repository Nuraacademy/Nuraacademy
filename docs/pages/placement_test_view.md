# Page: Placement Test

**Path**: `/src/app/classes/[id]/test/page.tsx`

## Features
- Intro screen with instructions and duration.
- Timed test runner.
- Renders Objective/Essay/Project questions dynamically.
- Auto-save and final submission.

## Backend Integration
- **Fetch**: Gets test data via `assessmentController.getPlacementTest(classId)`.
- **Submission**: Calls `assessmentController.submitPlacementTest(data)` upon completion.

---
[Back to README](../README.md)
