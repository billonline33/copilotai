# Project Requirements Document

## 1. Project Overview

This project is a simple to-do list application built with React.js and Next.js. It will use SCSS for styling, Cypress for end-to-end testing, and `json-server` with a local JSON file for data storage (no database required).

## 2. Objectives

- Provide a responsive to-do list application.
- Allow users to add, view, complete, and filter tasks.
- Ensure the application works on mobile, tablet, and desktop devices.

## 3. Scope

- **In Scope:**
  - To-do list page with add, complete, and filter functionality.
  - Navigation for filtering (all, uncompleted, completed).
  - Responsive design.
  - Local JSON file for data storage via `json-server`.
  - End-to-end tests with Cypress.
  - using typescript
  - using npm 
- **Out of Scope:**
  - User authentication.
  - Persistent database storage.
  - Advanced task features (e.g., due dates, priorities).

## 4. Stakeholders

- **Project Owner:** Oversees requirements and delivery.
- **Developer:** Implements the application.
- **Tester:** Validates functionality and usability.

## 5. Deliverables

- Next.js + React.js application source code.
- SCSS stylesheets.
- Cypress test scripts.
- JSON file for data storage.
- Documentation (README, setup instructions).

## 6. Functional Requirements

- **FR1:** User can view a list of tasks.
- **FR2:** User can add a new task.
- **FR3:** User can mark a task as completed.
- **FR4:** User can filter tasks by all, uncompleted, and completed.
- **FR5:** Data is persisted in a local JSON file via `json-server`.

## 7. Non-Functional Requirements

- **NFR1:** Application must be responsive.
- **NFR2:** Application must be accessible (basic ARIA support).
- **NFR3:** Application must load within 2 seconds on modern devices.
- **NFR4:** Codebase must follow best practices and be well-documented.

## 8. User Stories

- **US1:** As a user, I want to add a new task so that I can keep track of things to do.
- **US2:** As a user, I want to mark tasks as completed so I can see my progress.
- **US3:** As a user, I want to filter tasks so I can focus on what’s important.

## 9. Acceptance Criteria

- [ ] User can add a task via an input field and button.
- [ ] Tasks are displayed in a list.
- [ ] Each task can be marked as completed (checkbox or similar).
- [ ] Navigation allows switching between all, uncompleted, and completed tasks.
- [ ] Data persists after page reload (via `json-server`).
- [ ] Application is usable on mobile, tablet, and desktop.

## 10. Technical Constraints

- Use React.js and Next.js.
- Use SCSS for styling.
- Use `json-server` for local data storage.
- Use Cypress for end-to-end testing.

## 11. Timeline

- Estimated completion: 2 days.

## 12. Budget

- Not applicable.

## 13. Success Criteria

- All functional and non-functional requirements are met.
- All acceptance criteria are satisfied.
- Stakeholders approve the final deliverable.
