# Feature: Community (Forum)

Learners can interact and ask questions in the discussion forum.

## Data Model
- **DiscussionTopic**: The main thread/post. Categorized by type (Technical, General, etc.).
- **DiscussionReply**: Comments on a topic.

## Controller: `discussionController.ts`
- `getTopics(classId)`: Fetches all threads for a class.
- `createTopic(data)`: Posts a new thread.
- `getTopicWithReplies(topicId)`: Fetches a single thread with all its comments.
- `likeTopic(topicId)`: Increments the like count.

## Integration
- **Forum Page**: `/discussions`.
- **Topic View**: Detailed view within the discussions list.

---
[Back to README](../README.md)
