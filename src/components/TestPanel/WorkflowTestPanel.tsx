import { useMemo, useState } from 'react';
import { apiClient, ApiError } from '../../api/client';
import { serializeWorkflow } from '../../utils/serialization';
import type { WorkflowNodeDefinition, WorkflowNodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../stores/workflowStore';
import { simulateWorkflowExecution, type WorkflowExecutionLog } from './workflowExecution';

interface AutomationItem {
  id: string;
  name: string;
  description: string;
}

interface SimulationResponse {
  automationCount: number;
  logs: string[];
}

export function WorkflowTestPanel() {
  const { nodes } = useWorkflowStore();
  const [automationItems, setAutomationItems] = useState<AutomationItem[]>([]);
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const workflowDefinition = useMemo<WorkflowNodeDefinition[]>(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: node.type as WorkflowNodeType,
        data: node.data,
        position: node.position,
      })),
    [nodes],
  );

  const workflowJson = useMemo(() => serializeWorkflow(workflowDefinition), [workflowDefinition]);

  const loadAutomations = async () => {
    setErrorMessage(null);
    try {
      const response = await apiClient.get<{ automations: AutomationItem[] }>('/api/automations');
      setAutomationItems(response.automations);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? `Failed to load automations (${error.status}).` : 'Failed to load automations.');
    }
  };

  const runSimulation = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [localExecution, remoteExecution, automationResponse] = await Promise.all([
        simulateWorkflowExecution(workflowDefinition),
        apiClient.get<SimulationResponse>('/api/simulate'),
        apiClient.get<{ automations: AutomationItem[] }>('/api/automations'),
      ]);

      const combinedLogs: WorkflowExecutionLog[] = [
        ...localExecution.logs,
        { timestamp: new Date().toISOString(), level: 'info' as const, message: `Mock API reports ${remoteExecution.automationCount} automated step(s).` },
        ...remoteExecution.logs.map((message, index) => ({
          timestamp: new Date().toISOString(),
          level: (index === remoteExecution.logs.length - 1 ? 'success' : 'info') as WorkflowExecutionLog['level'],
          message,
        })),
      ];

      setAutomationItems(automationResponse.automations);
      setLogs(combinedLogs);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? `Simulation failed (${error.status}).` : 'Simulation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ marginTop: 24, display: 'grid', gap: 16 }}>
      <div style={{ border: '1px solid #dbe4ee', borderRadius: 16, padding: 16, background: '#fff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
        <h3 style={{ marginTop: 0 }}>Workflow test / sandbox</h3>
        <p style={{ color: '#64748b' }}>Serialize the current workflow, load mocked automations, and simulate execution.</p>
        {errorMessage ? <p style={{ color: '#b91c1c', marginTop: 0 }}>{errorMessage}</p> : null}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button type="button" onClick={loadAutomations} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #2563eb', background: '#dbeafe' }}>
            Load automations
          </button>
          <button type="button" onClick={runSimulation} disabled={isLoading} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #16a34a', background: isLoading ? '#f8fafc' : '#dcfce7' }}>
            {isLoading ? 'Running simulation…' : 'Run simulation'}
          </button>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <strong>Serialized workflow</strong>
          <pre style={{ margin: 0, padding: 12, borderRadius: 12, background: '#0f172a', color: '#e2e8f0', whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>
            {workflowJson}
          </pre>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <section style={{ border: '1px solid #dbe4ee', borderRadius: 16, padding: 16, background: '#fff' }}>
          <h4 style={{ marginTop: 0 }}>Mock automations</h4>
          {automationItems.length === 0 ? (
            <p style={{ color: '#64748b' }}>No automations loaded yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {automationItems.map((automation) => (
                <li key={automation.id} style={{ marginBottom: 8 }}>
                  <strong>{automation.name}</strong>
                  <div style={{ color: '#64748b', fontSize: 14 }}>{automation.description}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: '1px solid #dbe4ee', borderRadius: 16, padding: 16, background: '#fff' }}>
          <h4 style={{ marginTop: 0 }}>Execution logs</h4>
          {logs.length === 0 ? (
            <p style={{ color: '#64748b' }}>Run a simulation to view logs.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {logs.map((entry, index) => (
                <li key={`${entry.timestamp}-${index}`} style={{ marginBottom: 8 }}>
                  <strong style={{ textTransform: 'uppercase' }}>{entry.level}</strong>{' '}
                  <span style={{ color: '#64748b', fontSize: 12 }}>{entry.timestamp}</span>
                  <div>{entry.message}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
