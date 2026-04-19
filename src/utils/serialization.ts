import type { WorkflowNodeDefinition } from '../types/workflow';
import { workflowDefinitionSchema } from './validation';

export function serializeWorkflow(nodes: WorkflowNodeDefinition[]): string {
  return JSON.stringify({ nodes }, null, 2);
}

export function deserializeWorkflow(input: string): WorkflowNodeDefinition[] {
  const parsed = workflowDefinitionSchema.parse(JSON.parse(input));
  return parsed.nodes;
}
