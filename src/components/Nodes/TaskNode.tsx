import type { NodeProps } from 'reactflow';

import type { WorkflowNodeData } from '../../types/workflow';

import { WorkflowNodeFrame } from './WorkflowNodeFrame';

export function TaskNode(props: NodeProps<WorkflowNodeData>) {
  return <WorkflowNodeFrame {...props} title="Task" accentColor="#16a34a" kind="task" />;
}
