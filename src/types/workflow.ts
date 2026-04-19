export type WorkflowNodeType =
  | 'start'
  | 'task'
  | 'approval'
  | 'automatedStep'
  | 'end';

export interface WorkflowNodeData {
  label: string;
  description?: string;
}

export interface WorkflowEdgeData {
  label?: string;
}

export interface WorkflowNodeDefinition {
  id: string;
  type: WorkflowNodeType;
  data: WorkflowNodeData;
  position: { x: number; y: number };
}
