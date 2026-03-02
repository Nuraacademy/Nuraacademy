# Page: Discussion Forum

**Path**: `/src/app/discussions/page.tsx`

## Features
- Searchable list of topics.
- Filtering by category (Technical, General, etc.).
- "New Topic" dialog.
- Thread view with replies.

## Backend Integration
- **Topics**: Fetched using `discussionController.getTopics(classId)`.
- **Creation**: Calls `discussionController.createTopic(data)`.
- **Interaction**: Likes and replies handled via `discussionController`.

---
[Back to README](../README.md)
