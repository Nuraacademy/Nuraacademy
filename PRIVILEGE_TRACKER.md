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
| CourseMapping | `MANAGE` | Course mapping | 🟢 Implemented |
| GroupMapping | `CREATE` | Create Group mapping | 🟢 Implemented |
| GroupMapping | `UPDATE` | Edit group mapping | 🟢 Implemented |

## 2.0 Course
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Course | `CREATE_COURSE` | Create course | 🟢 Implemented |
| Course | `UPDATE_COURSE` | Update course | 🟢 Implemented |
| Course | `DELETE_COURSE` | Delete course | 🟢 Implemented |
| Course | `VIEW_SEARCH_COURSE` | View & search course | 🟢 Implemented |
| Course | `VIEW_DETAIL_COURSE` | View detail course | 🟢 Implemented (Public View) |
| Session | `CREATE_SESSION` | Create session | 🟢 Implemented |
| Session | `UPDATE_SESSION` | Update session | 🟢 Implemented |
| Session | `DELETE_SESSION` | Delete session | 🟢 Implemented |
| Session | `VIEW_SESSION` | View session | 🟢 Implemented (Public View) |
| Session | `START_SESSION` | Start session | 🟢 Implemented |
| Recording | `ADD_RECORDING` | Add recording | 🟢 Implemented |
| Recording | `UPDATE_RECORDING` | Update recording | 🟢 Implemented |
| Recording | `DELETE_RECORDING` | Delete recording | 🟢 Implemented |
| Presence | `CREATE_UPDATE_PRESENCE_SES` | Create/ update presence & SES | 🟢 Implemented |

## 3.0 Assignment
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Assignment | `CREATE_UPDATE_ASSIGNMENT` | Create/ update assignment | 🟢 Implemented |
| Assignment | `PRE_POST_TEST` | Pre-post test | 🟢 Implemented |
| Assignment | `SEARCH_VIEW_ASSIGNMENT` | Search & view assignment | 🟢 Implemented |
| Assignment | `DELETE_ASSIGNMENT` | Delete assignment | 🟢 Implemented |
| Assignment | `START_ASSIGNMENT_INSTRUCTOR` | Start assignment (instructur/ trainer) | 🟢 Implemented |
| Assignment | `START_ASSIGNMENT_LEARNER` | Start assignment (learner) | 🟢 Implemented |
| Assignment | `VIEW_ASSIGNMENT_RESULT` | View assignment result | 🟢 Implemented |
| Assignment | `CHECK_ASSIGNMENT_RESULT` | Check assignment result | 🟢 Implemented |
| Assignment | `VIEW_ASSIGNMENT_SCORE` | View assignment score | 🟢 Implemented |

## 4.0 Class
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Class | `CREATE_UPDATE_CLASS` | Create/ update class | 🟢 Implemented |
| Class | `DELETE_CLASS` | Delete class | 🟢 Implemented |
| Class | `SEARCH_VIEW_CLASS` | Search & view class | 🟢 Implemented (Public View) |
| Class | `UPDATE_SCHEDULE_CLASS` | Update schedule class | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_CREATE` | Placement test create | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_UPDATE` | Placement test update | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_VIEW_DETAIL` | Placement test view detail | 🟢 Implemented |
| PlacementTest | `PLACEMENT_TEST_CHECKING` | Placement test checking | 🟢 Implemented |
| Curricula | `UPLOAD_CURRICULA` | Upload curricula | 🟢 Implemented |
| Curricula | `UPDATE_CURRICULA` | Update curricula | 🟢 Implemented |
| Curricula | `DELETE_CURRICULA` | Delete curricula | 🟢 Implemented |
| Curricula | `SEARCH_VIEW_CURRICULA` | Curricula view & search | 🟢 Implemented |
| Curricula | `VIEW_DETAIL_CURRICULA` | Curricula view detail | 🟢 Implemented |

## 5.0 Forums
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Forums | `CREATE_EDIT_TOPIC` | Create/ edit topic | 🟢 Implemented |
| Forums | `DELETE_SELF_TOPIC` | Delete own topic | 🟢 Implemented |
| Forums | `SEARCH_VIEW_TOPIC` | Search & view topic | 🟢 Implemented (Public View) |
| Forums | `REPLY_SELF_TOPIC` | Reply to own topic | 🟢 Implemented |
| Forums | `EDIT_SELF_REPLY` | Edit own reply | 🟢 Implemented |
| Forums | `DELETE_SELF_REPLY` | Delete own reply | 🟢 Implemented |
| Forums | `DELETE_OTHERS_TOPIC` | Delete others' topic | 🟢 Implemented |
| Forums | `REPLY_OTHERS_TOPIC` | Reply to others' topic | 🟢 Implemented |
| Forums | `EDIT_OTHERS_REPLY` | Edit others' reply | 🟢 Implemented |
| Forums | `DELETE_OTHERS_REPLY` | Delete others' reply | 🟢 Implemented |

## 6.0 Blogs
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Blogs | `POST_CREATE` | Post create | 🟢 Implemented |
| Blogs | `POST_SEARCH_VIEW` | Post search & view | 🟢 Implemented |
| Blogs | `POST_EDIT` | Post edit | 🟢 Implemented |
| Blogs | `POST_DELETE` | Post delete | 🟢 Implemented |

## 7.0 Reflection & Evaluation
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Feedback | `CREATE_EDIT_REFLECTION` | Create/edit reflection | 🟢 Implemented |
| Feedback | `CREATE_EDIT_ASSIGNMENT_FEEDBACK` | Create/edit Assignment feedback | 🟢 Implemented |
| Feedback | `CREATE_EDIT_PEER_FEEDBACK` | Create/edit Peer feedback | 🟢 Implemented |
| Feedback | `CREATE_EDIT_CLASS_FEEDBACK` | Create/edit class feedback | 🟢 Implemented |
| Feedback | `CREATE_EDIT_TRAINER_FEEDBACK` | Create/edit Trainer feedback | 🟢 Implemented |
| Feedback | `DELETE_REFLECTION` | Delete reflection | 🟢 Implemented |
| Feedback | `VIEW_SEARCH_REFLECTION` | View & search reflection | 🟢 Implemented |
| Feedback | `VIEW_DETAIL_REFLECTION` | View detail reflection | 🟢 Implemented |
| Feedback | `DELETE_ASSIGNMENT_FEEDBACK` | Delete assignment feedback | 🟢 Implemented |
| Feedback | `VIEW_SEARCH_ASSIGNMENT_FEEDBACK` | View & search assignment feedback | 🟢 Implemented |
| Feedback | `VIEW_DETAIL_ASSIGNMENT_FEEDBACK` | View detail assignment feedback | 🟢 Implemented |
| Feedback | `DELETE_PEER_FEEDBACK` | delete peer feedback | 🟢 Implemented |
| Feedback | `VIEW_SEARCH_PEER_FEEDBACK` | View & search peer feedback | 🟢 Implemented |
| Feedback | `VIEW_DETAIL_PEER_FEEDBACK` | View detail peer feedback | 🟢 Implemented |
| Feedback | `DELETE_TRAINER_FEEDBACK` | delete trainer feedback | 🟢 Implemented |
| Feedback | `VIEW_SEARCH_TRAINER_FEEDBACK` | View & search trainer feedback | 🟢 Implemented (Session-based ownership check) |
| Feedback | `VIEW_DETAIL_TRAINER_FEEDBACK` | View detail trainer feedback | 🟢 Implemented (Session-based ownership check) |

## 8.0 User management
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| User | `CREATE_EDIT_USER` | Create/ edit user | 🟢 Implemented |
| User | `VIEW_DETAIL_USER` | View detail user | 🟢 Implemented |
| User | `DELETE_USER` | Delete user | 🟢 Implemented |
| User | `VIEW_SEARCH_USER` | View & search user | 🟢 Implemented |

## 9.0 File management
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| File | `UPLOAD_FILE` | Upload file | 🟢 Implemented |
| File | `ATTACH_FILE` | Attach file | 🔴 Not Implemented (Feature Missing) |
| File | `DELETE_FILE` | Delete file | 🔴 Not Implemented (Feature Missing) |
| File | `EDIT_ATTACHMENT` | Edit attachment | 🔴 Not Implemented (Feature Missing) |
| File | `SEARCH_VIEW_FILE` | Search & View file | 🔴 Not Implemented (Feature Missing) |
| File | `VIEW_DETAIL_FILE` | Vie detail file | 🔴 Not Implemented (Feature Missing) |

## 10.0 Analytics & Report
| Resource | Action | Description | Status |
| :--- | :--- | :--- | :--- |
| Analytics | `ANALYTICS_REPORT_LEARNER` | Analytics report learner | 🟢 Implemented |
| Analytics | `LEARNER_REPORT` | Learner report | 🟢 Implemented |
| Analytics | `ANALYTICS_REPORT_TRAINER` | Analytics report trainer | 🟢 Implemented |
| Analytics | `TRAINER_REPORT` | Trainer report | 🟢 Implemented |
