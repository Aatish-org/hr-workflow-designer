import type { WorkflowNodeDefinition } from '../../types/workflow';

export interface WorkflowExecutionLog {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface WorkflowExecutionResult {
  automationCount: number;
  logs: WorkflowExecutionLog[];
}

export interface WorkflowSimulationResponse {
  automationCount: number;
  logs: string[];
}

export async function simulateWorkflowExecution(nodes: WorkflowNodeDefinition[]): Promise<WorkflowExecutionResult> {
  const automationCount = nodes.filter((node) => node.type === 'automatedStep').length;
  const logs: WorkflowExecutionLog[] = [
    { timestamp: new Date().toISOString(), level: 'info', message: `Loaded ${nodes.length} nodes into the simulator.` },
    { timestamp: new Date().toISOString(), level: 'info', message: `Detected ${automationCount} automated step(s).` },
    { timestamp: new Date().toISOString(), level: automationCount > 0 ? 'success' : 'warning', message: automationCount > 0 ? 'Automation endpoints are ready to execute.' : 'No automated steps found in the workflow.' },
  ];

  return { automationCount, logs };
}
