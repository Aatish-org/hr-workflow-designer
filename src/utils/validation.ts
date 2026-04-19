import { z } from 'zod';

export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['start', 'task', 'approval', 'automatedStep', 'end']),
  data: z.object({
    label: z.string().min(1),
    description: z.string().optional(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const workflowDefinitionSchema = z.object({
  nodes: z.array(workflowNodeSchema),
});
