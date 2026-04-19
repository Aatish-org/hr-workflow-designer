export type WorkflowNodeType =
  | 'start'
  | 'task'
  | 'approval'
  | 'automatedStep'
  | 'end';

export interface WorkflowNodeBaseData {
  label: string;
  description?: string;
}

export interface StartNodeData extends WorkflowNodeBaseData {
  nodeType: 'start';
  trigger?: 'manual' | 'event';
}

export interface TaskNodeData extends WorkflowNodeBaseData {
  nodeType: 'task';
  assignee?: string;
}

export interface ApprovalNodeData extends WorkflowNodeBaseData {
  nodeType: 'approval';
  approverRole?: string;
  requiredApprovalCount?: number;
}

export interface AutomatedStepNodeData extends WorkflowNodeBaseData {
  nodeType: 'automatedStep';
  automationKey?: string;
}

export interface EndNodeData extends WorkflowNodeBaseData {
  nodeType: 'end';
  outcome?: 'complete' | 'cancel';
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

export type WorkflowNodeDataByType = {
  start: StartNodeData;
  task: TaskNodeData;
  approval: ApprovalNodeData;
  automatedStep: AutomatedStepNodeData;
  end: EndNodeData;
};

export type WorkflowNodeUpdateDataByType = {
  start: Omit<StartNodeData, 'nodeType'>;
  task: Omit<TaskNodeData, 'nodeType'>;
  approval: Omit<ApprovalNodeData, 'nodeType'>;
  automatedStep: Omit<AutomatedStepNodeData, 'nodeType'>;
  end: Omit<EndNodeData, 'nodeType'>;
};

export type WorkflowNodeUpdatePayload<T extends WorkflowNodeType> = Omit<WorkflowNodeDataByType[T], 'nodeType'>;

export interface WorkflowEdgeData {
  label?: string;
}

export interface WorkflowNodeDefinition {
  id: string;
  type: WorkflowNodeType;
  data: WorkflowNodeData;
  position: { x: number; y: number };
}

export function isNodeType<T extends WorkflowNodeType>(
  node: WorkflowNodeDefinition,
  type: T,
): node is WorkflowNodeDefinition & { type: T; data: WorkflowNodeDataByType[T] } {
  return node.type === type;
}
