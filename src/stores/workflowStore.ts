import { create } from 'zustand';
import type { Edge, Node } from 'reactflow';
import type { WorkflowNodeData, WorkflowNodeDefinition, WorkflowNodeType, WorkflowNodeUpdatePayload } from '../types/workflow';
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
  validationErrors: string[];
  validateWorkflow: () => void;
}

const initialNodes: Node<WorkflowNodeData>[] = [
  { id: 'start-1', type: 'start', position: { x: 120, y: 120 }, data: { nodeType: 'start', label: 'Start', trigger: 'manual' } },
  { id: 'task-1', type: 'task', position: { x: 380, y: 120 }, data: { nodeType: 'task', label: 'Review request', assignee: 'HR' } },
  { id: 'approval-1', type: 'approval', position: { x: 650, y: 120 }, data: { nodeType: 'approval', label: 'Manager approval', approverRole: 'Manager', requiredApprovalCount: 1 } },
  { id: 'automated-1', type: 'automatedStep', position: { x: 920, y: 120 }, data: { nodeType: 'automatedStep', label: 'Provision access', automationKey: 'provision-access' } },
  { id: 'end-1', type: 'end', position: { x: 1190, y: 120 }, data: { nodeType: 'end', label: 'End', outcome: 'complete' } },
];

const initialEdges: Edge[] = [
  { id: 'e-start-task', source: 'start-1', target: 'task-1', type: 'smoothstep' },
  { id: 'e-task-approval', source: 'task-1', target: 'approval-1', type: 'smoothstep' },
  { id: 'e-approval-auto', source: 'approval-1', target: 'automated-1', type: 'smoothstep' },
  { id: 'e-auto-end', source: 'automated-1', target: 'end-1', type: 'smoothstep' },
];

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
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setActiveNodeType: (activeNodeType) => set({ activeNodeType }),
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
