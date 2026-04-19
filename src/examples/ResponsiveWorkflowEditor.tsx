import { useMemo, useState, type DragEvent } from 'react';
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
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from 'reactflow';
import { NodeSidebar } from '../components/Canvas/NodeSidebar';
import { useNodeSelection } from '../hooks/useNodeSelection';
import { useWorkflowValidation } from '../hooks/useWorkflowValidation';
import { deserializeWorkflow, serializeWorkflow } from '../utils/serialization';
import type { WorkflowNodeData, WorkflowNodeDefinition, WorkflowNodeType } from '../types/workflow';
import { StartNode } from '../components/Nodes/StartNode';
import { TaskNode } from '../components/Nodes/TaskNode';
import { ApprovalNode } from '../components/Nodes/ApprovalNode';
import { AutomatedStepNode } from '../components/Nodes/AutomatedStepNode';
import { EndNode } from '../components/Nodes/EndNode';
import { useWorkflowStore } from '../stores/workflowStore';
import styles from '../components/Canvas/WorkflowEditor.module.css';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automatedStep: AutomatedStepNode,
  end: EndNode,
};

const initialWorkflowNodes: Node<WorkflowNodeData>[] = [
  { id: 'start-1', type: 'start', position: { x: 120, y: 120 }, data: { label: 'Start' } },
  { id: 'task-1', type: 'task', position: { x: 380, y: 120 }, data: { label: 'Review request' } },
  { id: 'approval-1', type: 'approval', position: { x: 650, y: 120 }, data: { label: 'Manager approval' } },
  { id: 'automated-1', type: 'automatedStep', position: { x: 920, y: 120 }, data: { label: 'Provision access' } },
  { id: 'end-1', type: 'end', position: { x: 1190, y: 120 }, data: { label: 'End' } },
];

const initialEdges: Edge[] = [
  { id: 'e-start-task', source: 'start-1', target: 'task-1', type: 'smoothstep' },
  { id: 'e-task-approval', source: 'task-1', target: 'approval-1', type: 'smoothstep' },
  { id: 'e-approval-auto', source: 'approval-1', target: 'automated-1', type: 'smoothstep' },
  { id: 'e-auto-end', source: 'automated-1', target: 'end-1', type: 'smoothstep' },
];

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

/**
 * Responsive WorkflowEditor Component
 *
 * Breakpoints:
 * - Desktop: > 1024px (3 columns: 220px | flex | 360px)
 * - Tablet: 768px - 1024px (3 columns: 180px | flex | 280px)
 * - Mobile: < 768px (stacked: toolbar + canvas + form panel)
 */
export function ResponsiveWorkflowEditor() {
  const [nodes, setNodes] = useState(initialWorkflowNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [showJson, setShowJson] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { selectedNodeId, setSelectedNodeId } = useNodeSelection<string>();
  const { setNodes: setStoreNodes, setEdges: setStoreEdges, selectNode, deleteNode, getSelectedNode } = useWorkflowStore();

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
    setNodes((current) => {
      const next = applyNodeChanges(changes, current);
      setStoreNodes(next);
      return next;
    });
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((current) => {
      const next = applyEdgeChanges(changes, current);
      setStoreEdges(next);
      return next;
    });
  };

  const onConnect = (connection: Connection) => {
    setEdges((current) => {
      const next = addEdge({ ...connection, type: 'smoothstep' }, current);
      setStoreEdges(next);
      return next;
    });
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

    setNodes((current) => {
      const next = [...current, makeNode(type, position)];
      setStoreNodes(next);
      return next;
    });
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    deleteNode(selectedNodeId);
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const selectedNode = getSelectedNode();

  return (
    <div className={styles.workflowContainer}>
      {/* Mobile toolbar - only visible on mobile */}
      <div className={styles.mobileToolbar}>
        <button
          type="button"
          className={`${styles.toggleButton} ${showSidebar ? styles.active : ''}`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰ {showSidebar ? 'Hide' : 'Show'} Nodes
        </button>
      </div>

      {/* Left sidebar */}
      <div className={`${styles.leftSidebar} ${showSidebar ? styles.visible : ''}`}>
        <NodeSidebar onDragStart={onDragStart} />
      </div>

      {/* Canvas area */}
      <div className={styles.canvasArea}>
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
            setSelectedNodeId(node.id);
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
            <div>
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1f2937',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                {showJson ? 'Hide JSON' : 'Show JSON'}
              </button>
              {showJson && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 8,
                    background: '#1f2937',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    maxWidth: 420,
                    maxHeight: 240,
                    overflow: 'auto',
                  }}
                >
                  <strong style={{ color: '#e5e7eb', fontSize: 13 }}>Serialized workflow</strong>
                  <pre
                    style={{
                      margin: '8px 0 0',
                      whiteSpace: 'pre-wrap',
                      fontSize: 11,
                      color: '#d1d5db',
                      fontFamily: 'monospace',
                    }}
                  >
                    {workflowJson}
                  </pre>
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        {/* Your form panel content goes here */}
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>Node Configuration</h3>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
            {selectedNode ? selectedNode.data.label : 'Select a node to edit'}
          </p>
        </div>
      </div>
    </div>
  );
}
