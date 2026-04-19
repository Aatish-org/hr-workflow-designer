import { http, HttpResponse } from 'msw';
import type { WorkflowNodeDefinition } from '../types/workflow';

const automationCatalog = [
  { id: 'notify-hr', name: 'Notify HR', description: 'Send a notification to HR.' },
  { id: 'provision-access', name: 'Provision Access', description: 'Create access accounts for the employee.' },
  { id: 'archive-request', name: 'Archive Request', description: 'Store the workflow request for auditing.' },
];

export const handlers = [
  http.get('/api/workflow', () => {
    const nodes: WorkflowNodeDefinition[] = [];
    return HttpResponse.json({ nodes });
  }),
  http.get('/api/automations', () => {
    return HttpResponse.json({ automations: automationCatalog });
  }),
  http.post('/api/simulate', async ({ request }) => {
    const body = (await request.json()) as { workflow?: { nodes?: WorkflowNodeDefinition[] } };
    const nodes = body.workflow?.nodes ?? [];
    const automationCount = nodes.filter((node) => node.type === 'automatedStep').length;
    return HttpResponse.json({
      automationCount,
      logs: [
        `Received workflow with ${nodes.length} node(s).`,
        automationCount > 0 ? `Found ${automationCount} automated step(s).` : 'No automated steps found.',
        'Simulation finished successfully.',
      ],
    });
  }),
];
