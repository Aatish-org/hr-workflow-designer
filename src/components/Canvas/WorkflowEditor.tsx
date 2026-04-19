import { useMemo, type DragEvent } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from 'reactflow';
import { NodeSidebar } from './NodeSidebar';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { deserializeWorkflow, serializeWorkflow } from '../../utils/serialization';
import type { WorkflowNodeData, WorkflowNodeDefinition, WorkflowNodeType } from '../../types/workflow';
import { StartNode } from '../Nodes/StartNode';
import { TaskNode } from '../Nodes/TaskNode';
import { ApprovalNode } from '../Nodes/ApprovalNode';
import { AutomatedStepNode } from '../Nodes/AutomatedStepNode';
import { EndNode } from '../Nodes/EndNode';
import { TaskNodeForm } from '../Forms/TaskNodeForm';
import { ApprovalNodeForm } from '../Forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from '../Forms/AutomatedStepNodeForm';
import { StartNodeForm } from '../Forms/StartNodeForm';
import { EndNodeForm } from '../Forms/EndNodeForm';
import { useWorkflowStore } from '../../stores/workflowStore';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automatedStep: AutomatedStepNode,
  end: EndNode,
};

const emptyWorkflow = deserializeWorkflow('{"nodes":[]}');

function makeNode(type: WorkflowNodeType, position: { x: number; y: number }): Node<WorkflowNodeData> {
  const labelMap: Record<WorkflowNodeType, string> = {
    start: 'Start',
    task: 'Task',
    approval: 'Approval',
    automatedStep: 'Automated Step',
    end: 'End',
  };

  return {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: { label: labelMap[type] },
  };
}

export function WorkflowEditor() {
  const {
    nodes,
    edges,
    selectedNodeId,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    selectNode,
    deleteNode,
    getSelectedNode,
  } = useWorkflowStore();

  const workflowNodes = useMemo(() => nodes.map((node) => ({
    id: node.id,
    type: node.type as WorkflowNodeType,
    data: node.data,
    position: node.position,
  })) satisfies WorkflowNodeDefinition[], [nodes]);

  const validation = useWorkflowValidation(workflowNodes);

  const workflowJson = useMemo(
    () => serializeWorkflow(workflowNodes),
    [workflowNodes],
  );

  const onNodesChange = (changes: NodeChange[]) => {
    const next = applyNodeChanges(changes, nodes);
    setStoreNodes(next);
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    const next = applyEdgeChanges(changes, edges);
    setStoreEdges(next);
  };

  const onConnect = (connection: Connection) => {
    const next = addEdge({ ...connection, type: 'smoothstep' }, edges);
    setStoreEdges(next);
  };

  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
    if (!type) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    const next = [...nodes, makeNode(type, position)];
    setStoreNodes(next);
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    deleteNode(selectedNodeId);
    selectNode(null);
  };

  const selectedNode = getSelectedNode();
  const renderNodeForm = () => {
    if (!selectedNode) {
      return <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Select a node to edit its configuration.</p>;
    }

    switch (selectedNode.type) {
      case 'task':
        return <TaskNodeForm />;
      case 'approval':
        return <ApprovalNodeForm />;
      case 'automatedStep':
        return <AutomatedStepNodeForm />;
      case 'start':
        return <StartNodeForm />;
      case 'end':
        return <EndNodeForm />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', minHeight: 760, border: '1px solid #e5e7eb', borderRadius: 18, overflow: 'hidden', background: '#fff' }}>
      <NodeSidebar onDragStart={onDragStart} />
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={(_, node) => {
            selectNode(node.id);
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background gap={18} size={1} />
          <MiniMap />
          <Controls />
          <Panel position="top-right">
            <div style={{ display: 'grid', gap: 8, minWidth: 280, padding: 12, borderRadius: 14, background: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)' }}>
              <strong>Workflow status</strong>
              <span>Validation: {validation.success ? 'Valid' : 'Invalid'}</span>
              <span>Nodes: {nodes.length}</span>
              <span>Edges: {edges.length}</span>
              <span>Template nodes: {emptyWorkflow.length}</span>
              <span>Selected: {selectedNode?.data.label ?? 'none'}</span>
              <button type="button" onClick={deleteSelectedNode} disabled={!selectedNodeId} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #ef4444', background: selectedNodeId ? '#fee2e2' : '#f8fafc', cursor: selectedNodeId ? 'pointer' : 'not-allowed' }}>
                Delete selected node
              </button>
            </div>
          </Panel>
          <Panel position="bottom-left">
            <div style={{ padding: 12, borderRadius: 14, background: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)', maxWidth: 420 }}>
              <strong>Serialized workflow</strong>
              <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 180, overflow: 'auto' }}>{workflowJson}</pre>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      <aside style={{ width: 360, borderLeft: '1px solid #e5e7eb', background: '#f8fafc', padding: 16, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Node configuration</h2>
          {renderNodeForm()}
        </div>
      </aside>
    </div>
  );
}
