import type { NodeProps } from 'reactflow';

import type { WorkflowNodeData } from '../../types/workflow';

import { WorkflowNodeFrame } from './WorkflowNodeFrame';

export function AutomatedStepNode(props: NodeProps<WorkflowNodeData>) {
  return <WorkflowNodeFrame {...props} title="Automated Step" accentColor="#7c3aed" kind="automatedStep" />;
}
