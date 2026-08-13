# HR Workflow Designer

A robust, interactive web application for designing and visualizing HR workflows, built as a prototype for the Tredence HR Workflow Designer case study.

## 🚀 Features

- **Interactive Canvas**: Powered by `@xyflow/react`, enabling drag-and-drop creation of nodes, and connecting workflow steps intuitively.
- **Node Palette**: A sidebar containing various workflow node types: Start, Task, Approval, Automated Step, and End.
- **Dynamic Configuration Panel**: Context-sensitive properties panel that adapts to the currently selected node type:
  - **Start**: Define workflow trigger events.
  - **Task**: Assign tasks and define dynamic custom fields.
  - **Approval**: Assign approvers and set auto-approve thresholds.
  - **Automated Step**: Select system actions (e.g., Send Email, Trigger Webhook) and configure their requisite parameters.
  - **End**: Provide an end message and toggle summary display.
- **Workflow Simulation Engine**: A built-in validation and mock execution engine. 
  - Checks for disconnected nodes and infinite cycles.
  - Simulates execution step-by-step with localized execution traces and configuration detailing.
- **Local Persistence**: Workflows are automatically saved to browser `localStorage` as they are modified and instantly restored on load.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Workflow Engine**: `@xyflow/react` (React Flow)
- **Icons**: Lucide React
- **Ids**: UUID 

## 📁 Folder Structure

```text
src/
├── api/             # Mock API & Simulation Generators
├── assets/          # Static assets
├── components/      # UI Components
│   ├── NodeConfigPanel/ # Dynamic configuration forms based on node type
│   ├── Sidebar/         # Node palette
│   ├── SimulationPanel/ # Execution runner & log visualizer
│   └── WorkflowCanvas/  # React Flow canvas wrapper
├── forms/           # Form implementations for node configurations
├── hooks/           # Custom React hooks (useWorkflowState)
├── nodes/           # Custom React Flow Node components
├── types/           # TypeScript interfaces and types
└── utils/           # Validation and helper logic
```

## ⚙️ Setup Instructions

To run this project locally:

1. Clone or extract the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app in your browser (usually `http://localhost:5173`).

To build for production:
```bash
npm run build
```

## 🧠 Design Decisions & Architecture

- **Unidirectional Data Flow**: The application is structured around a single source of truth for the workflow state, managed in the `useWorkflowState` hook. Changes from the canvas, sidebar, or config panel route through this hook.
- **Mock-First Architecture**: Features are built around a simulated `mockApi.ts` layer using Async Generators (`async function*`) to safely yield processing iterations simulating a backend without needing one.
- **Modular Components**: The right-side tool panels (`StartForm`, `ApprovalForm`, etc.) have their data strictly bounded.
- **Isolated Layouting**: Separated concerns amongst `App.tsx` (routing/layout), `Canvas.tsx` (rendering items), and `ConfigPanel.tsx` (manipulating properties).
- **Persistent Local Caching**: `localStorage` was intentionally configured to strip out transient temporary state (e.g., executing flags) prior to saving in order to guarantee clean reload states.

## 💡 Assumptions

- Form inputs are validated leniently during drafting, but structural errors are caught strictly by the Simulation Engine's validation pass (e.g., cycle checking).
- Automated Steps simulate the existence of robust backend microservices, mocked safely internally.
- There are no external databases or user authentication layers currently provided or required by the environment.

## 🔮 Future Improvements

- **Undo/Redo History**: Add robust state-snapshot management to support a timeline of actions.
- **Canvas Minimap/Layout Auto-align**: An overarching auto-layout button mapping out complex workflows using packages like Elkjs or Dagre.
- **Zoom-to-Fit on Selection**: Improved interactivity that immediately repositions the camera based on searched configuration.
- **Custom React Flow Edge Types**: Allowing branched logic directly represented with annotated UI edges (e.g., "Approved" vs "Rejected" pathways).
