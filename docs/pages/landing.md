# Page: Landing Page

**Path**: `/src/app/page.tsx`

## Features
- Hero section with global stats.
- "Why Choose Us" cards.
- Success stories.
- **Top Classes**: Displays the top 3 featured classes.

## Backend Integration
- **Stats**: Fetched using `prisma.user.count()` and enrollment counts (TBD).
- **Classes**: Fetches using `classController.getTopClasses()`.

---
[Back to README](../README.md)
