# Akij Online Assessment Platform

A simplified online assessment system with two panels:

- Employer Panel
- Candidate Panel

This project is built to demonstrate frontend architecture, reusable component patterns, state management, form validation, and complex workflow handling.

## Tech Stack

- Framework: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS v4 + reusable shadcn-style UI primitives
- State Management: Zustand (with persistence)
- Forms: React Hook Form
- Validation: Zod
- API Handling: Axios + React Query
- Icons/Utilities: lucide-react, date-fns

## Features

### Employer Panel

- Login (mock authentication)
- Dashboard with exam cards showing:
	- Exam Name
	- Candidates
	- Question Sets
	- Exam Slots
	- View Candidates action
- Create Online Test (multi-step)
	- Step 1: Basic Info
	- Step 2: Question Sets (add/edit/delete via modal)

### Candidate Panel

- Login (mock authentication)
- Dashboard with exam cards showing:
	- Duration
	- Questions
	- Negative Marking
	- Start action
- Exam Screen
	- Question rendering (Checkbox/Radio/Text)
	- Live countdown timer
	- Auto-submit on timeout
	- Manual submit
	- Behavior tracking
		- Tab switch detection
		- Fullscreen exit detection

## Bonus Backend/API Note

This app includes mock backend logic through Next.js route handlers in [app/api](app/api):

- [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
- [app/api/exams/route.ts](app/api/exams/route.ts)
- [app/api/exams/[examId]/route.ts](app/api/exams/[examId]/route.ts)
- [app/api/exams/[examId]/submit/route.ts](app/api/exams/[examId]/submit/route.ts)

Data is kept in-memory in [lib/mock-db.ts](lib/mock-db.ts).

## Demo Credentials

- Employer
	- Email: employer@akij.com
	- Password: employer123
- Candidate
	- Email: candidate@akij.com
	- Password: candidate123

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

4. Run lint/build checks:

```bash
npm run lint
npm run build
```

## Project Structure

- [app](app)
	- App routes, UI screens, and API route handlers
- [components](components)
	- Reusable UI components and providers
- [hooks](hooks)
	- Reusable behavioral hooks (auth guard, timer, tracking)
- [stores](stores)
	- Zustand stores for auth and exam attempts
- [lib](lib)
	- API client, query config, utility helpers, mock database
- [types](types)
	- Shared TypeScript domain types

## Additional Questions

### MCP Integration

- Have you worked with any MCP (Model Context Protocol)?
	- Yes.
- If yes: Which MCP did you use, what work did you perform, and what was accomplished?
	- MCPs/Tooling workflows used: codebase/context tooling, browser/devtools-style workflows, and data exploration workflows.
	- Work performed:
		- Faster project-wide context lookup and implementation tracing.
		- UI behavior checks (timers, forms, navigation, and interaction flow).
		- Iterative debug-fix-verify cycles during feature polishing.
	- Accomplished:
		- Reduced time spent on manual searching and repeated checks.
		- Improved implementation consistency and faster issue resolution.
- If no: Describe an idea of how MCP could be used in this project.
	- Not applicable because MCP workflows were already used.
	- Additional useful ideas for this project:
		- Figma MCP: map design tokens/components directly into UI implementation.
		- Chrome DevTools MCP: automated responsiveness/performance/accessibility inspection.
		- Supabase MCP: migrate mock APIs to persistent exam/candidate/submission tables.

### AI Tools for Development

- Which AI tools or processes have you used or recommend to speed up frontend development?
	- GitHub Copilot: in-editor coding, refactors.
	- ChatGPT / Claude Code: architecture discussion, edge-case planning, and implementation refinement.
	- Recommended process:
		- Generate first pass with AI.
		- Manually review UX, naming, and edge cases.
		- Run lint/build and verify major user flows after each milestone.

### Offline Mode Strategy for Exam Continuity

- How would you handle offline mode if a candidate loses internet during an exam?
	- Save answers locally (IndexedDB preferred) on every change and at short intervals.
	- Keep an offline-safe timer by storing exam start timestamp and elapsed time checkpoints.
	- Queue pending submission and behavior events while offline.
	- Detect reconnect, sync queued data, and submit automatically.
	- Show clear offline/reconnecting status to the candidate.
	- Keep server-side validation on final submit to prevent tampering.

## Deliverables Checklist

- GitHub repository with the project code: https://github.com/Munaimun/Online-Assessment-Platform
- README with setup instructions: Included in this file.
- Completed answers to the additional questions in the README: Included in this file.
- Live demo link in the README: https://online-assessment-platform-six.vercel.app/
- Video recording of the app and link shared in the README: https://screenapp.io/app/v/zCu16-AAmw
- Bonus points for implementing backend/API integration: Implemented using Next.js API route handlers with mock backend logic.

