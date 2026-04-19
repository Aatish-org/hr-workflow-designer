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
import { NodeSidebar } from './NodeSidebar';
import { useNodeSelection } from '../../hooks/useNodeSelection';
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
import { PerformanceMetricsPanel } from '../Metrics/PerformanceMetricsPanel';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automatedStep: AutomatedStepNode,
  end: EndNode,
};

const initialWorkflowNodes: Node<WorkflowNodeData>[] = [
  { id: 'start-1', type: 'start', position: { x: 120, y: 120 }, data: { nodeType: 'start', label: 'User Initializing', description: 'Initializing for Automation', trigger: 'manual' } },
  { id: 'task-1', type: 'task', position: { x: 420, y: 120 }, data: { nodeType: 'task', label: 'Data Collection', description: 'Collecting applicant records', assignee: 'HR' } },
  { id: 'approval-1', type: 'approval', position: { x: 730, y: 120 }, data: { nodeType: 'approval', label: 'Policy Approval', description: 'Approver confirmation step', approverRole: 'Manager', requiredApprovalCount: 1 } },
  { id: 'automated-1', type: 'automatedStep', position: { x: 1040, y: 120 }, data: { nodeType: 'automatedStep', label: 'Automation Dispatch', description: 'Executing downstream tasks', automationKey: 'provision-access' } },
  { id: 'end-1', type: 'end', position: { x: 1350, y: 120 }, data: { nodeType: 'end', label: 'Completion', description: 'Workflow finished', outcome: 'complete' } },
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
    data: { nodeType: type, label: labelMap[type], description: 'Initializing for Automation' },
  };
}

export function WorkflowEditor() {
  const [nodes, setNodes] = useState(initialWorkflowNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [showJson, setShowJson] = useState(false);
  const { selectedNodeId, setSelectedNodeId } = useNodeSelection<string>();
  const { setNodes: setStoreNodes, setEdges: setStoreEdges, selectNode, deleteNode, getSelectedNode, setNodeExecutionStats } = useWorkflowStore();

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
      const createdNode = makeNode(type, position);
      const next = [...current, createdNode];
      setNodeExecutionStats(createdNode.id, { failures: 11, total: 27, successes: 41, pending: 72 });
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

  const renderSelectedNodeForm = () => {
    if (!selectedNode) {
      return (
        <div style={{ padding: 16, color: '#6b7280', fontSize: 14 }}>
          Select a node on the canvas to edit it.
        </div>
      );
    }

    switch (selectedNode.type) {
      case 'start':
        return <StartNodeForm />;
      case 'task':
        return <TaskNodeForm />;
      case 'approval':
        return <ApprovalNodeForm />;
      case 'automatedStep':
        return <AutomatedStepNodeForm />;
      case 'end':
        return <EndNodeForm />;
      default:
        return (
          <div style={{ padding: 16, color: '#6b7280', fontSize: 14 }}>
            Unknown node type: {selectedNode.type}
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', minHeight: 760, border: '1px solid #e5e7eb', borderRadius: 18, overflow: 'hidden', background: '#fff' }}>
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #e5e7eb' }}>
        <NodeSidebar onDragStart={onDragStart} />
      </div>
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
      <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid #e5e7eb', background: '#f8fafc', overflowY: 'auto' }}>
        <PerformanceMetricsPanel />
        <div style={{ borderTop: '1px solid #e5e7eb', padding: 14, background: '#fff' }}>
          <strong style={{ color: '#0f172a', fontSize: 14 }}>Node Configuration</strong>
          <div style={{ marginTop: 8 }}>{renderSelectedNodeForm()}</div>
        </div>
      </div>
    </div>
  );
}
