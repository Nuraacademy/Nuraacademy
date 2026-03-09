# Role Privileges Implementation Tracker

This document tracks the implementation status of all the privileges seeded into the database for the Role-Based Access Control (RBAC) system. 

**Legend:**
- 🟢 **Implemented**: Backend `requirePermission` added and Frontend UI elements hidden/protected.
- 🔴 **Not Implemented**: Needs backend/frontend protection.

## 1.0 Enrollment
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Enrollment | `LEARNER_REGISTRATION` | Learner registration | 🟢 Implemented (Public Action) |
| Enrollment | `LEARNER_ENROLLMENT` | Learner enrollment | 🟢 Implemented |
| Enrollment | `CHECKOUT_CLASS` | Check out class | 🟢 Implemented |
| Enrollment | `PAYMENT_GATEWAY` | Payment gateway | 🟢 Implemented |
| CourseMapping | `MANAGE` | Course mapping | 🔴 Not Implemented (Feature Missing) |
| GroupMapping | `CREATE` | Create Group mapping | 🔴 Not Implemented (Feature Missing) |
| GroupMapping | `UPDATE` | Edit group mapping | 🟢 Implemented |

## 2.0 Course
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Course | `CREATE_COURSE` | Create course | 🟢 Implemented |
| Course | `UPDATE_COURSE` | Update course | 🟢 Implemented |
| Course | `DELETE_COURSE` | Delete course | 🔴 Not Implemented (Feature Missing) |
| Course | `VIEW_SEARCH_COURSE` | View & search course | 🔴 Not Implemented (Feature Missing) |
| Course | `VIEW_DETAIL_COURSE` | View detail course | 🟢 Implemented (Public View) |
| Session | `CREATE_SESSION` | Create session | 🟢 Implemented |
| Session | `UPDATE_SESSION` | Update session | 🟢 Implemented |
| Session | `DELETE_SESSION` | Delete session | 🟢 Implemented |
| Session | `VIEW_SESSION` | View session | 🟢 Implemented (Public View) |
| Session | `START_SESSION` | Start session | 🔴 Not Implemented (Feature Missing) |
| Recording | `ADD_RECORDING` | Add recording | 🔴 Not Implemented (Feature Missing) |
| Recording | `UPDATE_RECORDING` | Update recording | 🔴 Not Implemented (Feature Missing) |
| Recording | `DELETE_RECORDING` | Delete recording | 🔴 Not Implemented (Feature Missing) |
| Presence | `CREATE_UPDATE_PRESENCE_SES` | Create/ update presence & SES | 🔴 Not Implemented (Feature Missing) |

## 3.0 Assignment
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Assignment | `CREATE_UPDATE_ASSIGNMENT` | Create/ update assignment | 🔴 Not Implemented |
| Assignment | `PRE_POST_TEST` | Pre-post test | 🔴 Not Implemented |
| Assignment | `COURSE_ASSIGNMENT` | Course assignment | 🔴 Not Implemented |
| Assignment | `EXERCISES` | Exercises | 🔴 Not Implemented |
| Assignment | `FINAL_PROJECT` | Final project | 🔴 Not Implemented |
| Assignment | `SEARCH_VIEW_ASSIGNMENT` | Search & view assignment | 🔴 Not Implemented |
| Assignment | `DELETE_ASSIGNMENT` | Delete assignment | 🔴 Not Implemented |
| Assignment | `START_ASSIGNMENT_INSTRUCTOR` | Start assignment (instructur/ trainer) | 🔴 Not Implemented |
| Assignment | `START_ASSIGNMENT_LEARNER` | Start assignment (learner) | 🔴 Not Implemented |
| Assignment | `VIEW_ASSIGNMENT_RESULT` | View assignment result | 🔴 Not Implemented |
| Assignment | `CHECK_ASSIGNMENT_RESULT` | Check assignment result | 🔴 Not Implemented |
| Assignment | `VIEW_ASSIGNMENT_SCORE` | View assignment score | 🔴 Not Implemented |

## 4.0 Class
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Class | `CREATE_UPDATE_CLASS` | Create/ update class | 🔴 Not Implemented |
| Class | `DELETE_CLASS` | Delete class | 🔴 Not Implemented |
| Class | `SEARCH_VIEW_CLASS` | Search & view class | 🔴 Not Implemented |
| Class | `UPDATE_SCHEDULE_CLASS` | Update schedule class | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_CREATE` | Placement test create | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_UPDATE` | Placement test update | 🔴 Not Implemented |
| PlacementTest | `PLACEMENT_TEST_VIEW_SEARCH` | Placement test view & search | 🔴 Not Implemented |
| PlacementTest | `PLACEMENT_TEST_VIEW_DETAIL` | Placement test view detail | 🔴 Not Implemented |
| PlacementTest | `PLACEMENT_TEST_CHECKING` | Placement test checking | 🔴 Not Implemented |
| Curricula | `UPLOAD_CURRICULA` | Upload curricula | 🔴 Not Implemented |
| Curricula | `UPDATE_CURRICULA` | Update curricula | 🔴 Not Implemented |
| Curricula | `DELETE_CURRICULA` | Delete curricula | 🔴 Not Implemented |
| Curricula | `SEARCH_VIEW_CURRICULA` | Search & view curricula | 🔴 Not Implemented |
| Curricula | `VIEW_DETAIL_CURRICULA` | View detail curricula | 🔴 Not Implemented |

## 5.0 Forums
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Forums | `CREATE_EDIT_TOPIC` | Create/ edit topic | 🔴 Not Implemented |
| Forums | `DELETE_TOPIC` | Delete topic | 🔴 Not Implemented |
| Forums | `SEARCH_VIEW_TOPIC` | Search & view topic | 🔴 Not Implemented |
| Forums | `REPLY_TOPIC` | Reply topic | 🔴 Not Implemented |
| Forums | `EDIT_REPLY` | Edit reply | 🔴 Not Implemented |
| Forums | `DELETE_REPLY` | Delete reply | 🔴 Not Implemented |

## 6.0 Wikis
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Wikis | `POST_CREATE` | Post create | 🔴 Not Implemented |
| Wikis | `POST_SEARCH_VIEW` | Post search & view | 🔴 Not Implemented |
| Wikis | `POST_EDIT` | Post edit | 🔴 Not Implemented |
| Wikis | `POST_DELETE` | Post delete | 🔴 Not Implemented |

## 7.0 Reflection & Evaluation
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Feedback | `CREATE_EDIT_REFLECTION` | Create/edit reflection | 🔴 Not Implemented |
| Feedback | `CREATE_EDIT_ASSIGNMENT_FEEDBACK` | Create/edit Assignment feedback | 🔴 Not Implemented |
| Feedback | `CREATE_EDIT_PEER_FEEDBACK` | Create/edit Peer feedback | 🔴 Not Implemented |
| Feedback | `CREATE_EDIT_CLASS_FEEDBACK` | Create/edit class feedback | 🔴 Not Implemented |
| Feedback | `CREATE_EDIT_TRAINER_FEEDBACK` | Create/edit Trainer feedback | 🔴 Not Implemented |
| Feedback | `DELETE_REFLECTION` | Delete reflection | 🔴 Not Implemented |
| Feedback | `VIEW_SEARCH_REFLECTION` | View & search reflection | 🔴 Not Implemented |
| Feedback | `VIEW_DETAIL_REFLECTION` | View detail reflection | 🔴 Not Implemented |
| Feedback | `DELETE_ASSIGNMENT_FEEDBACK` | Delete assignment feedback | 🔴 Not Implemented |
| Feedback | `VIEW_SEARCH_ASSIGNMENT_FEEDBACK` | View & search assignment feedback | 🔴 Not Implemented |
| Feedback | `VIEW_DETAIL_ASSIGNMENT_FEEDBACK` | View detail assignment feedback | 🔴 Not Implemented |
| Feedback | `DELETE_PEER_FEEDBACK` | delete peer feedback | 🔴 Not Implemented |
| Feedback | `VIEW_SEARCH_PEER_FEEDBACK` | View & search peer feedback | 🔴 Not Implemented |
| Feedback | `VIEW_DETAIL_PEER_FEEDBACK` | View detail peer feedback | 🔴 Not Implemented |
| Feedback | `DELETE_TRAINER_FEEDBACK` | delete trainer feedback | 🔴 Not Implemented |
| Feedback | `VIEW_SEARCH_TRAINER_FEEDBACK` | View & search trainer feedback | 🔴 Not Implemented |
| Feedback | `VIEW_DETAIL_TRAINER_FEEDBACK` | View detail trainer feedback | 🔴 Not Implemented |

## 8.0 User management
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| User | `CREATE_EDIT_USER` | Create/ edit user | 🟢 Implemented (via default registration) |
| User | `VIEW_DETAIL_USER` | View detail user | 🔴 Not Implemented |
| User | `DELETE_USER` | Delete user | 🔴 Not Implemented |
| User | `VIEW_SEARCH_USER` | View & search user | 🟢 Implemented (Admin UI) |

## 9.0 File management
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| File | `UPLOAD_FILE` | Upload file | 🔴 Not Implemented |
| File | `ATTACH_FILE` | Attach file | 🔴 Not Implemented |
| File | `DELETE_FILE` | Delete file | 🔴 Not Implemented |
| File | `EDIT_ATTACHMENT` | Edit attachment | 🔴 Not Implemented |
| File | `SEARCH_VIEW_FILE` | Search & View file | 🔴 Not Implemented |
| File | `VIEW_DETAIL_FILE` | Vie detail file | 🔴 Not Implemented |

## 10.0 Analytics & Report
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Analytics | `ANALYTICS_REPORT_LEARNER` | Analytics report learner | 🔴 Not Implemented |
| Analytics | `LEARNER_REPORT` | Learner report | 🔴 Not Implemented |
| Analytics | `ANALYTICS_REPORT_TRAINER` | Analytics report trainer | 🔴 Not Implemented |
| Analytics | `TRAINER_REPORT` | Trainer report | 🔴 Not Implemented |
