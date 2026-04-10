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

Yes, I have worked with MCP concepts and tool-driven workflows.

- Example MCPs used:
	- Database/context MCPs for schema exploration and query execution
	- Browser/devtools style MCP workflows for UI verification and behavior inspection
- Work performed:
	- Rapid context retrieval from project systems
	- Structured, tool-assisted debugging loops
	- Faster implementation-validation cycles
- Outcome:
	- Reduced manual context switching
	- Better accuracy in code changes and diagnostics

If introducing MCP ideas into this project, useful options would be:

- Figma MCP for token extraction and component parity from design files
- Chrome DevTools MCP for runtime performance, accessibility, and behavior-tracking verification
- Supabase MCP for quickly moving from mock API to persistent exam/candidate/submission data

### AI Tools for Development

Recommended tools/processes:

- GitHub Copilot: in-editor code generation and refactor acceleration
- ChatGPT/Claude Code: design iteration, architecture critique, and edge-case discovery
- AI-assisted workflow to speed delivery:
	- Generate base modules and typed contracts
	- Add manual review pass for readability and constraints
	- Run lint/build/test loop after each milestone

### Offline Mode Strategy for Exam Continuity

If a candidate loses internet during an exam:

- Persist answers locally (IndexedDB/localStorage) every few seconds and on each change
- Keep timer source-of-truth resilient:
	- Use server-issued exam start timestamp
	- Continue countdown locally from that timestamp if disconnected
- Queue submission payload while offline
- Auto-resume sync and submit when network returns
- Show explicit offline banner and sync status
- Keep anti-cheat events buffered with timestamps, then send on reconnect

## Deliverables Checklist

- GitHub repository with full code: TODO - add repo URL
- Live demo link in README: TODO - add deployment URL
- Video walkthrough link in README: TODO - add video URL

