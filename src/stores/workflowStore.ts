import { create } from 'zustand';
import type { Edge, Node } from 'reactflow';
import type { WorkflowNodeData, WorkflowNodeDefinition, WorkflowNodeType, WorkflowNodeUpdatePayload } from '../types/workflow';
import type { NodeExecutionStats, WorkflowMetrics } from '../types/metrics';
import { validateWorkflowStructure } from '../utils/validation';

export interface WorkflowStoreState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  activeNodeType: WorkflowNodeType | null;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  updateNode: <T extends WorkflowNodeType>(nodeId: string, nodeType: T, data: WorkflowNodeUpdatePayload<T>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setActiveNodeType: (nodeType: WorkflowNodeType | null) => void;
  getSelectedNode: () => Node<WorkflowNodeData> | undefined;
  syncFromDefinitions: (definitions: WorkflowNodeDefinition[]) => void;
  nodeExecutionStats: Record<string, NodeExecutionStats>;
  workflowMetrics: WorkflowMetrics;
  setNodeExecutionStats: (nodeId: string, stats: NodeExecutionStats) => void;
  getNodeExecutionStats: (nodeId: string) => NodeExecutionStats;
  validationErrors: string[];
  validateWorkflow: () => void;
}

const initialNodes: Node<WorkflowNodeData>[] = [
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

const defaultNodeStats: NodeExecutionStats = {
  failures: 11,
  total: 27,
  successes: 41,
  pending: 72,
};

const initialNodeExecutionStats = Object.fromEntries(
  initialNodes.map((node) => [node.id, { ...defaultNodeStats }]),
);

const initialWorkflowMetrics: WorkflowMetrics = {
  coverage: {
    title: '📈 Automation Coverage',
    description: 'Your last week is better by 72%',
    percentage: 72,
  },
  workflows: [
    {
      id: 'workflow-a',
      title: 'Workflow A',
      triggeredBy: 'User Actions',
      metrics: { tasks: 35, executions: 12, completed: 8 },
    },
    {
      id: 'workflow-b',
      title: 'Workflow B',
      triggeredBy: 'Scheduled Automation',
      metrics: { tasks: 10, executions: 13, completed: 9 },
    },
  ],
  insightMetrics: [
    { id: 'daily-executions', icon: '⚡', title: 'Executions Today', description: 'Workflow runs in the last 24h', value: '124' },
    { id: 'success-rate', icon: '✅', title: 'Success Rate', description: 'Average success over active nodes', value: '91%' },
    { id: 'warning-nodes', icon: '⚠️', title: 'Warning Nodes', description: 'Nodes waiting for intervention', value: '07' },
  ],
  flowObjectives: [
    { id: 'output-generation', icon: '🧾', title: 'Output Generation', description: 'Current completion pace', value: '68%' },
    { id: 'lorem-ipsum', icon: '🛡️', title: 'Lorem Ipsum', description: 'Automated policy checks passed', value: '92%' },
    { id: 'action-trigger', icon: '🎬', title: 'Action Trigger', description: 'Avg. trigger reaction time', value: '1.4m' },
  ],
};

function toWorkflowDefinitions(nodes: Node<WorkflowNodeData>[]): WorkflowNodeDefinition[] {
  return nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: node.data,
    position: node.position,
  })) as WorkflowNodeDefinition[];
}

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  activeNodeType: null,
  nodeExecutionStats: initialNodeExecutionStats,
  workflowMetrics: initialWorkflowMetrics,
  validationErrors: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node], activeNodeType: node.type as WorkflowNodeType })),
  updateNode: (nodeId, nodeType, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId && node.type === nodeType
          ? { ...node, data: { ...data, nodeType } as WorkflowNodeData }
          : node,
      ),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      nodeExecutionStats: Object.fromEntries(
        Object.entries(state.nodeExecutionStats).filter(([id]) => id !== nodeId),
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setActiveNodeType: (activeNodeType) => set({ activeNodeType }),
  setNodeExecutionStats: (nodeId, stats) =>
    set((state) => ({
      nodeExecutionStats: {
        ...state.nodeExecutionStats,
        [nodeId]: stats,
      },
    })),
  getNodeExecutionStats: (nodeId) => get().nodeExecutionStats[nodeId] ?? defaultNodeStats,
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((node) => node.id === selectedNodeId);
  },
  syncFromDefinitions: (definitions) =>
    set({
      nodes: definitions.map((definition) => ({
        id: definition.id,
        type: definition.type,
        position: definition.position,
        data: definition.data,
      })),
    }),
  validateWorkflow: () => {
    const result = validateWorkflowStructure(toWorkflowDefinitions(get().nodes), get().edges);
    set({ validationErrors: result.errors });
  },
}));
