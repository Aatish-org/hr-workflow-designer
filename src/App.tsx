import { WorkflowEditor } from './components/Canvas/WorkflowEditor';

function App() {
  return (
    <main style={{ padding: 24, background: '#f1f5f9' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>HR Workflow Designer</h1>
        <p style={{ margin: '8px 0 0', color: '#475569' }}>
          Drag nodes from the sidebar, connect them on the canvas, select to inspect, and delete as needed.
        </p>
      </div>
      <WorkflowEditor />
    </main>
  );
}

export default App;
