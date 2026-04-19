import { z } from 'zod';
import type { Edge } from 'reactflow';
import type { WorkflowNodeDefinition } from '../types/workflow';

const baseNodeSchema = z.object({
  id: z.string().min(1),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const workflowNodeSchema = z.discriminatedUnion('type', [
  baseNodeSchema.extend({
    type: z.literal('start'),
    data: z.object({
      nodeType: z.literal('start'),
      label: z.string().min(1),
      description: z.string().optional(),
      trigger: z.enum(['manual', 'event']).optional(),
    }),
  }),
  baseNodeSchema.extend({
    type: z.literal('task'),
    data: z.object({
      nodeType: z.literal('task'),
      label: z.string().min(1),
      description: z.string().optional(),
      assignee: z.string().optional(),
    }),
  }),
  baseNodeSchema.extend({
    type: z.literal('approval'),
    data: z.object({
      nodeType: z.literal('approval'),
      label: z.string().min(1),
      description: z.string().optional(),
      approverRole: z.string().optional(),
      requiredApprovalCount: z.number().int().positive().optional(),
    }),
  }),
  baseNodeSchema.extend({
    type: z.literal('automatedStep'),
    data: z.object({
      nodeType: z.literal('automatedStep'),
      label: z.string().min(1),
      description: z.string().optional(),
      automationKey: z.string().optional(),
    }),
  }),
  baseNodeSchema.extend({
    type: z.literal('end'),
    data: z.object({
      nodeType: z.literal('end'),
      label: z.string().min(1),
      description: z.string().optional(),
      outcome: z.enum(['complete', 'cancel']).optional(),
    }),
  }),
]);

export const workflowDefinitionSchema = z.object({
  nodes: z.array(workflowNodeSchema),
});

export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateWorkflowStructure(nodes: WorkflowNodeDefinition[], edges: Edge[]): WorkflowValidationResult {
  const errors: string[] = [];
  const startNodes = nodes.filter((node) => node.type === 'start');
  const endNodes = nodes.filter((node) => node.type === 'end');

  if (startNodes.length !== 1) {
    errors.push('Workflow must contain exactly one start node.');
  }

  if (endNodes.length < 1) {
    errors.push('Workflow must contain at least one end node.');
  }

  const nodeIds = new Set(nodes.map((node) => node.id));
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      adjacency.get(edge.source)?.push(edge.target);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (hasCycle(next)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (hasCycle(node.id)) {
      errors.push('Workflow cannot contain cycles.');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
