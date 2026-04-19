import type { NodeProps } from 'reactflow';

import type { WorkflowNodeData } from '../../types/workflow';

import { WorkflowNodeFrame } from './WorkflowNodeFrame';

export function ApprovalNode(props: NodeProps<WorkflowNodeData>) {
  return <WorkflowNodeFrame {...props} title="Approval" accentColor="#d97706" kind="approval" />;
}
