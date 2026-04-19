import type { NodeProps } from 'reactflow';

import type { WorkflowNodeData } from '../../types/workflow';

import { WorkflowNodeFrame } from './WorkflowNodeFrame';

export function StartNode(props: NodeProps<WorkflowNodeData>) {
  return <WorkflowNodeFrame {...props} title="Start" accentColor="#0284c7" kind="start" />;
}
