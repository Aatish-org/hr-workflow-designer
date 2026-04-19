import { useMemo, useState } from 'react';
import { apiClient, ApiError } from '../../api/client';
import { serializeWorkflow } from '../../utils/serialization';
import { validateWorkflowStructure, type WorkflowValidationResult } from '../../utils/validation';
import type { WorkflowNodeDefinition, WorkflowNodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../stores/workflowStore';
import { simulateWorkflowExecution, type WorkflowExecutionLog, type WorkflowSimulationResponse } from './workflowExecution';

interface AutomationItem {
  id: string;
  name: string;
  description: string;
}

export function WorkflowTestPanel() {
  const { nodes, edges, validationErrors } = useWorkflowStore();
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
  const structuralValidation = useMemo<WorkflowValidationResult>(() => validateWorkflowStructure(workflowDefinition, edges), [workflowDefinition, edges]);

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
    setLogs([]);

    try {
      const localExecution = await simulateWorkflowExecution(workflowDefinition);
      setLogs(localExecution.logs);

      const [simulationResponse, automationResponse] = await Promise.all([
        apiClient.get<WorkflowSimulationResponse>(`/api/simulate?workflow=${encodeURIComponent(workflowJson)}`),
        apiClient.get<{ automations: AutomationItem[] }>('/api/automations'),
      ]);

      setLogs((current) => [
        ...current,
        { timestamp: new Date().toISOString(), level: 'info', message: `Mock API reports ${simulationResponse.automationCount} automated step(s).` },
        ...simulationResponse.logs.map((message, index) => ({
          timestamp: new Date().toISOString(),
          level: (index === simulationResponse.logs.length - 1 ? 'success' : 'info') as WorkflowExecutionLog['level'],
          message,
        })),
      ]);

      setAutomationItems(automationResponse.automations);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? `Simulation failed (${error.status}).` : 'Simulation failed.');
      setLogs((current) => [
        ...current,
        { timestamp: new Date().toISOString(), level: 'error', message: 'Simulation request failed.' },
      ]);
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
        {validationErrors.length > 0 ? (
          <ul style={{ margin: '0 0 12px', paddingLeft: 18, color: '#7f1d1d' }}>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <strong>Structural checks</strong>
          {structuralValidation.errors.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#7f1d1d' }}>
              {structuralValidation.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : (
            <span style={{ color: '#166534' }}>Workflow structure looks valid.</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button type="button" onClick={loadAutomations} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #2563eb', background: '#dbeafe' }}>
            Load automations
          </button>
          <button type="button" onClick={runSimulation} disabled={isLoading || !structuralValidation.valid} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #16a34a', background: isLoading ? '#f8fafc' : '#dcfce7' }}>
            {isLoading ? 'Running simulation…' : 'Run Simulation'}
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
