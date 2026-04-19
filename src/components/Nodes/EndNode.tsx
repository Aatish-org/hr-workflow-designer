import type { NodeProps } from 'reactflow';

import type { WorkflowNodeData } from '../../types/workflow';

import { WorkflowNodeFrame } from './WorkflowNodeFrame';

export function EndNode(props: NodeProps<WorkflowNodeData>) {
  return <WorkflowNodeFrame {...props} title="End" accentColor="#dc2626" kind="end" />;
}
