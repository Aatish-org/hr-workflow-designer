import ReactFlow, { Background, Controls, MiniMap, type Node } from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowCanvasProps {
  nodes: Node[];
}

export function WorkflowCanvas({ nodes }: WorkflowCanvasProps) {
  return (
    <div style={{ height: 420, width: '100%', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'hidden' }}>
      <ReactFlow nodes={nodes} edges={[]} fitView>
        <Background gap={16} size={1} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
