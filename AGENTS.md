# AGENTS.md

## Project Goal

- The project goal is to implement the frontend big-screen dashboard for `中嘉英瑞年度绩效看板`.

## Scope

- The first version is frontend page effects only. Do not connect backend APIs.
- Do not implement login.
- Do not implement permission control.
- Do not add complex routing.

## Design Constraints

- Do not build this as a normal admin dashboard.
- The result must be an enterprise-grade data big screen.
- Optimize for `1920x1080` as the primary target resolution.
- The default page filter must be `2026 Q1`.

## Data Rules

- Page numbers must be manually editable.
- Before every numeric modification, save the previous data into `localStorage` history first.

## Engineering Constraints

- Do not create a new git worktree unless the user explicitly asks for it.
- Do not introduce unrelated dependencies.
- Keep the code simple and clear.
- Do not add complexity for showmanship.

## Validation

- After each completed change, always run lint.
- After each completed change, always run build.

## Final Response Format

- After completing work, only report:
- what was done
- what the result is
- whether lint passed
- whether build passed
