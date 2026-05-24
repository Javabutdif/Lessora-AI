# Lessora AI

![Lessora AI logo](./assets/Lessora-ai%20logo.png)

Lessora AI is an AI-powered lesson planning application for teachers. It helps educators turn a topic, grade level, class duration, and learning goals into organized lesson plans that are easier to prepare, review, and reuse.

The project is built around a simple goal: reduce the time teachers spend preparing class materials so they can focus more on instruction, student engagement, and classroom outcomes.

## What the Application Does

Lessora AI gives teachers a mobile-first workspace for creating and managing lesson plans. Teachers can sign up, log in, open a personalized dashboard, start a new AI-assisted lesson plan, review recent plans, and track teaching activity from one place.

The current application includes an Expo React Native client and a Node.js API. The backend already supports user authentication and includes service and data-model groundwork for AI-generated lesson plans.

## Current Features

- Teacher onboarding with Lessora AI branding and app introduction
- Account registration and login
- Secure password hashing on the server
- JWT-based authenticated sessions
- Saved mobile sessions with automatic expired-token logout
- Personalized dashboard greeting using the logged-in teacher profile
- Recent lesson plan preview area
- AI suggestion preview card for improving lesson content
- Lesson plan creation screen with inputs for:
  - topic or subject
  - grade level
  - lesson duration
  - specific goals or standards
- Grade-level picker from preschool through senior high school
- AI lesson generation service structure with placeholder generation logic
- Lesson plan schema for storing draft text, sessions, objectives, content, activities, status, tags, visibility, and AI metadata
- Teaching analytics screen with summary cards for plans created, time saved, and average rating
- Activity overview placeholder for future charting
- Profile screen with teacher name, email, initials, and account actions
- Logout flow with confirmation toast
- Bottom-tab dashboard navigation for Home, Generate, Analytics, and Profile
- Shared mobile UI components for buttons, cards, inputs, section headers, and assistant-style floating actions
- MongoDB/Mongoose data models for users and lesson plans
- Express API structure with validation, error handling, authentication routes, and service boundaries

## Product Direction

Lessora AI is intended to grow into a curriculum-ready planning assistant for educators. Planned and partially prepared areas include real OpenAI lesson generation, richer lesson plan management, saved plan history, refinement workflows, analytics charts, and classroom-ready exports.

## Repository Overview

- `client-side/` contains the Expo React Native mobile application.
- `server-side/` contains the Node.js and Express API.
- `assets/` contains shared image and logo assets.
- `docs/` contains project notes, implementation plans, specs, and agent workflow documentation.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for the full license text.

## Contributors

- Jims

