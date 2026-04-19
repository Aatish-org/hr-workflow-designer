# HR Workflow Designer

A Vite + React + TypeScript app for designing HR workflows with React Flow, schema validation, Zustand state management, and MSW-powered mock APIs.

## Features

- Drag-and-drop React Flow canvas
- Five custom workflow node types
  - Start
  - Task
  - Approval
  - Automated Step
  - End
- Controlled node forms with shared state
- Node selection and deletion
- Workflow validation with Zod
- Workflow serialization / deserialization helpers
- Mock API endpoints with MSW
- Sandbox panel for loading automations, running simulations, and viewing execution logs

## Tech stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Flow](https://reactflow.dev/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [MSW](https://mswjs.io/)

## Project structure

Key folders under `src/`:

- `components/Canvas` — React Flow canvas, editor shell, and node sidebar
- `components/Nodes` — custom HTML node renderers
- `components/Forms` — controlled node forms and shared panel fields
- `components/TestPanel` — sandbox panel, execution helper, logs
- `stores` — Zustand workflow store
- `hooks` — workflow selection and validation hooks
- `api` — API client and MSW handlers
- `mocks` — MSW browser worker
- `types` — workflow interfaces
- `utils` — validation and serialization helpers

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```powershell
npm install
```

### Start the dev server

```powershell
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

### Build for production

```powershell
npm run build
```

### Preview the production build

```powershell
npm run preview
```

## Mock API setup

MSW is configured with a browser worker in `src/mocks/browser.ts` and handler definitions in `src/api/mocks.ts`.

Available mock endpoints:

- `GET /api/workflow`
- `GET /api/automations`
- `POST /api/simulate`

### Notes

The browser worker is ready to be started in your app if you want to enable it during development or in a specific UI bootstrap flow.

## Workflow editing flow

1. Drag a node from the sidebar onto the canvas.
2. Select a node to populate its form panel.
3. Edit the node values and save.
4. Connect nodes using React Flow handles.
5. Delete the selected node using the canvas controls or form panel.

## Validation

Workflow data is validated with Zod before serialization and in the sandbox / simulation flows.

## Sandbox / test panel

The test panel can:

- Serialize the current workflow
- Load mocked automations
- Run a simulated workflow execution
- Display execution logs

## Troubleshooting

### Blank page / worker not active

If mock endpoints don’t respond, ensure the MSW worker is started in the browser boot flow.

### TypeScript errors

Run:

```powershell
npm run build
```

If you recently added a node type or form, make sure the type is included in:

- `src/types/workflow.ts`
- `src/utils/validation.ts`
- `src/components/Canvas/WorkflowEditor.tsx`
- `src/stores/workflowStore.ts`

### React Flow layout issues

If the canvas looks cramped, clear browser zoom or open the page in a larger viewport. The editor is designed for wide layouts.

## Next ideas

- Persist workflows to localStorage or a backend
- Add a node inspector side panel
- Add import / export JSON actions
- Add test coverage for serialization and sandbox behavior
