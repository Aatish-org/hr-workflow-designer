import { workflowDefinitionSchema } from '../utils/validation';
import type { WorkflowNodeDefinition } from '../types/workflow';

export function useWorkflowValidation(nodes: WorkflowNodeDefinition[]) {
  return workflowDefinitionSchema.safeParse({ nodes });
}
