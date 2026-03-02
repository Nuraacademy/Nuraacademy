# View Groups

The Groups page (`/classes/[id]/groups`) allows users to see the study groups formed within a class, often based on placement test results or enrollment data.

## Features
- **Group Listing**: Shows all groups in the class with member counts.
- **Member Detail**: Lists the names of all users in each group.

## Backend Integration
- **Server Component**: Fetches class details and all associated groups.
- **Controller**: Uses `classController.getClassGroups`.
- **Relationship**: Connects `Group` -> `GroupMember` -> `User` models.
