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

