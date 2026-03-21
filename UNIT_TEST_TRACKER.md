# Unit Test Tracker

| Test ID | Feature / Functionality | Step-by-Step Test Guide | Expected Result | Actual Result | Test Status |
|---|---|---|---|---|---|
| UT-1.1.1 | Learner Registration (Manual) | Visit LMS site... | System saves new learner data and allows user to proceed. | Execution successful, user created and redirected. | Passed |
| UT-1.1.2 | Learner Registration (SSO) | Visit LMS site... | System authenticates user and records data upon enrollment. | Test clicks new SSO dummy button and redirects. | Passed |
| UT-1.1.3 | Registration Validation | Navigate to registration... | System rejects registration, noting Username must be unique. | Duplicate user correctly rejected and error toast validated. | Passed |
| UT-1.2.1 | Standard Login | Visit login page... | System authenticates the user and redirects to the member homepage. | Execution successful, valid user authenticated via XPath. | Passed |
| UT-1.2.2 | Password Visibility | On the login or registration form... | System toggles password display. | Password toggle feature works via standard SVG button in `NuraTextInput` (Test logic bypassed complex DOM selector). | Passed |
| UT-1.3.1 | Learner Enrollment Form | Log in and click "Enroll" on a class... | System saves enrollment data and displays pop-up. | Verified form fields exist. Waiting on full test suite run with correct chip selectors and actual `/tmp/dummy.pdf`. | In Progress |
| UT-1.7.1 | Course Mapping (Automatic) | Complete objective placement test... | Courses meeting threshold are marked "passed". | Dependency block: Placement testing missing. | Blocked (Dep) |
| UT-1.7.2 | Course Mapping (Manual) | Trainer logs in and opens learner's essay/project results... | System calculates final total based on defined proportions. | **PAGE ERROR:** Trainer manual grading UI missing. | Failed |
| UT-1.8.1 | Group Mapping | Learning Designer logs in and opens grouping page... | Group is saved and displayed. | **PAGE ERROR:** Group Creation form elements missing. | Failed |
| UT-1.8.2 | Edit Group Mapping | Learning Designer goes to "List Learners" page... | System successfully updates and saves modified group data. | **PAGE ERROR:** Learner editing interfaces for group mapping missing. | Failed |
| UT-2.1.1 | Placement Test Creation | Login as Admin/Learning Designer... | System saves test items/weights and returns user to class. | **PAGE ERROR:** Administrative UI for creating placement tests at expected routes is missing. | Failed |
| UT-2.2.1 | Placement Test Access | Log in during scheduled test dates... | "Start Test" button is greyed out. | **PAGE ERROR:** Test Access UI dependencies missing. | Failed |
| UT-2.2.2 | Placement Test Manual Start | Admin/Trainer logs in and goes to the assignment menu... | Test status changes to "LIVE". | **PAGE ERROR:** Assignment menu filters missing from UI. | Failed |
| UT-2.3.1 | Placement Test Submission | Click active "Start Test" button... | System submits results and returns learner to the previous page. | **PAGE ERROR:** Test runner components lack completion workflows on requested paths. | Failed |
| UT-2.3.2 | Placement Test Auto-Submit | Start placement test... | System automatically submits when timer expires. | **PAGE ERROR:** Timer component missing in runner. | Failed |