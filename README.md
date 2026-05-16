# toast
Make content crispy

## Development

- `npm install` installs workspace dependencies.
- `npm run typecheck` runs TypeScript project checks for all packages.
- `npm test` runs the Vitest suite.
- `npm run build` builds all packages.

## Design

- [Toast AI Native Editor Design](docs/30-designs/TOAST-AI-NATIVE-EDITOR-DESIGN.md)
- [Image And Table Insert Design](docs/30-designs/IMAGE-TABLE-INSERT-DESIGN.md)
- [Editor SDK Requirements](docs/10-requirements/EDITOR-SDK-REQUIREMENTS.md)
- [Editor SDK Productization Design](docs/30-designs/EDITOR-SDK-PRODUCTIZATION-DESIGN.md)

## Current Decisions

- Phase 1 UI only supports React.
- `ToastPatch` uses JSON Patch with Toast-controlled paths.
- The default theme is a new neutral light/dark theme, not the legacy WeChat style.
