import { WorkflowEditor } from './components/Canvas/WorkflowEditor';

function App() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        background: '#f1f5f9',
        overflow: 'hidden',
      }}
    >
      <WorkflowEditor />
    </main>
  );
}

export default App;