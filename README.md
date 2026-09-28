# The Untested API — Task Manager

A take-home assignment for testing, debugging, and extending a small Task Manager REST API built with **Node.js, Express, Jest, and Supertest**.

The project uses an **in-memory data store**, so no database setup is required.

---

## Tech Stack

* Node.js
* Express.js
* Jest
* Supertest
* UUID

---

## Project Overview

The application is a simple Task Manager API that supports:

* Creating tasks
* Listing tasks
* Filtering tasks by status
* Paginating tasks
* Updating tasks
* Deleting tasks
* Completing tasks
* Viewing task statistics
* Assigning tasks to users

The main goal of this assignment was to:

1. Understand an unfamiliar codebase
2. Write unit and integration tests
3. Find bugs through testing
4. Fix identified bugs
5. Implement a new API feature
6. Verify the implementation with automated tests and coverage

---

## Project Structure

```text
task-api/
│
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── tasks.js
│   ├── services/
│   │   └── taskService.js
│   └── utils/
│       └── validators.js
│
├── tests/
│   ├── tasks.test.js
│   └── taskService.test.js
│
├── package.json
├── jest.config.js
├── ASSIGNMENT.md
└── README.md
```

### Important Files

| File                          | Purpose                                 |
| ----------------------------- | --------------------------------------- |
| `src/app.js`                  | Express application setup               |
| `src/routes/tasks.js`         | API route handlers                      |
| `src/services/taskService.js` | Business logic and in-memory task store |
| `src/utils/validators.js`     | Request validation                      |
| `tests/tasks.test.js`         | API integration tests using Supertest   |
| `tests/taskService.test.js`   | Unit tests for task service             |
| `jest.config.js`              | Jest configuration                      |

---

# Getting Started

## Prerequisites

* Node.js 18 or higher
* npm

## 1. Install dependencies

```bash
npm install
```

## 2. Start the application

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## 3. Run tests

```bash
npm test
```

## 4. Run tests with coverage

```bash
npm run coverage
```

---

# API Endpoints

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/tasks`                 | Get all tasks            |
| GET    | `/tasks?status=todo`     | Filter tasks by status   |
| GET    | `/tasks?page=1&limit=10` | Get paginated tasks      |
| POST   | `/tasks`                 | Create a task            |
| PUT    | `/tasks/:id`             | Update a task            |
| DELETE | `/tasks/:id`             | Delete a task            |
| PATCH  | `/tasks/:id/complete`    | Mark a task as completed |
| GET    | `/tasks/stats`           | Get task statistics      |
| PATCH  | `/tasks/:id/assign`      | Assign a task to a user  |

---

# Task Object

A task contains fields such as:

```json
{
  "id": "uuid",
  "title": "Write tests",
  "description": "",
  "status": "todo",
  "priority": "high",
  "dueDate": null,
  "completedAt": null,
  "createdAt": "ISO date"
}
```

Valid statuses:

```text
todo
in_progress
done
```

Valid priorities:

```text
low
medium
high
```

---

# Testing

Two types of automated tests were implemented.

## 1. Unit Tests

The file:

```text
tests/taskService.test.js
```

tests the business logic directly.

The following functions are tested:

* `create()`
* `findById()`
* `update()`
* `remove()`
* `completeTask()`

Both successful and failure scenarios are covered.

---

## 2. Integration Tests

The file:

```text
tests/tasks.test.js
```

uses **Supertest** to test the API through its HTTP endpoints.

The tests cover:

* GET tasks
* POST tasks
* Status filtering
* Pagination
* PUT update
* DELETE task
* Complete task
* Task statistics
* Assign task
* Invalid input
* Missing task / 404 cases
* Empty values
* Reassignment

---

# Test Results

Final test result:

```text
Test Suites: 2 passed, 2 total
Tests:       30 passed, 30 total
```

All tests are passing.

---

# Test Coverage

The final coverage result is:

| Metric     |   Coverage |
| ---------- | ---------: |
| Statements | **93.37%** |
| Branches   | **85.54%** |
| Functions  | **93.10%** |
| Lines      | **92.70%** |

The assignment requested **80%+ coverage**, and the project achieved more than 90% overall statement coverage.

---

# Bugs Found and Fixed

## Bug 1 — Incorrect Pagination Offset

### Location

```text
src/services/taskService.js
```

Function:

```text
getPaginated()
```

### Expected Behavior

For:

```text
/tasks?page=1&limit=2
```

the API should return the first two tasks.

### Actual Behavior

The first page skipped the first two tasks and started from the third task.

### How It Was Discovered

I created an integration test that created three tasks and verified the IDs returned for page 1.

The test compared the returned task IDs with the IDs of the first two created tasks.

### Root Cause

The original pagination calculation was:

```javascript
const offset = page * limit;
```

For page 1 and limit 2:

```text
offset = 1 × 2
offset = 2
```

This incorrectly started from index 2.

### Fix

The calculation was changed to:

```javascript
const offset = (page - 1) * limit;
```

For page 1:

```text
offset = (1 - 1) × 2
offset = 0
```

Therefore, the first page correctly starts with the first task.

### Verification

The pagination test passes after the fix.

---

## Bug 2 — Completing a Task Changed Its Priority

### Location

```text
src/services/taskService.js
```

Function:

```text
completeTask()
```

### Expected Behavior

Completing a task should:

```text
status → done
completedAt → current time
```

while keeping the existing priority.

### Actual Behavior

A high-priority task became medium priority after completion.

### How It Was Discovered

I created a task with:

```json
{
  "title": "High priority task",
  "priority": "high"
}
```

Then I completed it and verified that the priority should still be `high`.

The test exposed that the implementation was changing it to `medium`.

### Root Cause

The original implementation explicitly set:

```javascript
priority: 'medium'
```

when completing a task.

### Fix

The hardcoded priority assignment was removed.

The existing task object is preserved, so its original priority remains unchanged.

### Verification

The priority-preservation test passes after the fix.

---

# New Feature — Assign Task

Implemented the required endpoint:

```text
PATCH /tasks/:id/assign
```

## Request

```json
{
  "assignee": "Rupali"
}
```

## Response

The API returns the updated task with:

```json
{
  "id": "...",
  "title": "Task to assign",
  "assignee": "Rupali",
  "status": "todo",
  "priority": "medium"
}
```

## Validation

The endpoint rejects an empty assignee:

```json
{
  "assignee": ""
}
```

with:

```text
400 Bad Request
```

It also rejects whitespace-only values:

```json
{
  "assignee": "   "
}
```

The assignee is trimmed before being stored.

---

## Missing Task

If the task ID does not exist:

```text
PATCH /tasks/non-existing-id/assign
```

the API returns:

```text
404 Task not found
```

---

## Reassignment

If a task is already assigned, reassignment is allowed.

Example:

```text
First assignment:
Amit

Second assignment:
Rupali
```

The final assignee becomes:

```text
Rupali
```

### Design Decision

I chose to allow reassignment because the endpoint represents an assignment operation and the assignment does not explicitly prohibit changing the current assignee.

This also supports real-world situations where responsibility for a task needs to be transferred.

---

# What I Would Test Next

If I had more time before production, I would add tests for:

* Negative pagination values
* Invalid pagination limits
* Invalid status values
* Invalid priority values
* Invalid due dates
* Missing request bodies
* Malformed request bodies
* Additional pagination boundary cases
* Large numbers of tasks
* Concurrent task updates
* Error-handling middleware
* Authentication and authorization
* Rate limiting
* Performance under load
* Database persistence

---

# What Surprised Me

The main surprise was that the API appeared to work correctly for basic operations, but behavior-focused tests revealed subtle bugs.

For example:

* Pagination skipped the first page because of an incorrect offset calculation.
* Completing a task unexpectedly changed its priority.

These issues were identified by testing the expected behavior instead of only checking whether the API returned a successful status code.

---

# Questions Before Production

Before shipping this API to production, I would clarify:

1. Should task reassignment always be allowed?
2. Should an assignee be validated against a user database?
3. Should invalid pagination values return `400 Bad Request`?
4. Should sorting be supported?
5. What authentication and authorization rules are required?
6. Should the in-memory store be replaced with a database?
7. What are the expected performance requirements?
8. Are rate limits required?
9. What logging and monitoring should be implemented?
10. What should happen if two users update the same task at the same time?
11. Should API error responses follow a standardized format?

---

# Conclusion

This assignment helped demonstrate the complete workflow of working with an unfamiliar API:

```text
Read the code
     ↓
Write tests
     ↓
Run tests
     ↓
Find bugs
     ↓
Fix bugs
     ↓
Add new feature
     ↓
Test the feature
     ↓
Check coverage
```

Final result:

```text
30 / 30 tests passing
93.37% statement coverage
85.54% branch coverage
93.10% function coverage
92.70% line coverage
```

The implementation includes the required tests, bug fixes, and `PATCH /tasks/:id/assign` feature.
