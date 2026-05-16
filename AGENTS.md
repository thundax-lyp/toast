# Repository Guidelines

## Project Structure & Module Organization

This repository is currently minimal: `README.md` describes the project, `LICENSE` contains the Apache 2.0 license, `TODO.md` tracks the execution queue, and `.gitignore` is prepared for a future Node/Next.js-style app.

When source code is added, prefer conventional top-level directories:

- `src/` for app code.
- `tests/` or colocated `*.test.*` files for tests.
- `public/` for static assets.
- `docs/` for design notes and governance rules.

Do not commit generated directories such as `node_modules/`, `.next/`, `out/`, `build/`, `coverage/`, and `.vercel/`.

## Build, Test, and Development Commands

No package manifest or build system is present yet. After adding one, document exact commands in `README.md`. Typical Node/Next.js commands:

- `npm install` to install dependencies.
- `npm run dev` to run the local development server.
- `npm test` to run the test suite.
- `npm run build` to create a production build.
- `npm run lint` to run static checks.

Do not introduce tooling without adding matching config files and scripts.

## Coding Style & Naming Conventions

Match conventions established by the first implementation. For JavaScript or TypeScript, prefer 2-space indentation, camelCase variables, PascalCase React components, and kebab-case file names.

Use automated formatting and linting once code exists. Include relevant config and package scripts.

## Testing Guidelines

Add tests with the first meaningful source changes. Use behavior names such as `toast-message.test.ts` or `ToastMessage.test.tsx`. Keep tests deterministic.

If coverage tooling is added, write reports to ignored `coverage/`.

## Commit & Pull Request Guidelines

The current history contains only `Initial commit`, so no detailed convention is established. Use short, imperative commit messages.

Pull requests should include a summary, reason for change, test results, and screenshots for UI changes.

## TODO Workflow

Treat `TODO.md` as the execution queue, not a completion log. Follow `docs/00-governance/TODO-RULES.md` when adding, splitting, executing, or closing tasks. Only execute items in `当前任务项`; `待审阅任务项` and `待讨论项` require human confirmation.

Completed items should be deleted, split, or narrowed with the related code, tests, or docs.

## Documentation Governance

Follow `docs/00-governance/DOCUMENT-RULES.md` when adding, moving, splitting, or rewriting documents. Governance docs hold stable rules; `TODO.md` holds open tasks; commit and PR history hold completed work.

## Security & Configuration Tips

Do not commit secrets. `.env` and `.env*.local` are ignored; document required variable names with safe examples in `.env.example`.
