import type { ReactNode } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { WorkflowNodeData, WorkflowNodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../stores/workflowStore';

interface WorkflowNodeFrameProps extends NodeProps<WorkflowNodeData> {
  title: string;
  accentColor: string;
  kind: WorkflowNodeType;
  children?: ReactNode;
}

export function WorkflowNodeFrame({ id, data, selected, title, accentColor, kind, children }: WorkflowNodeFrameProps) {
  const stats = useWorkflowStore((state) => state.getNodeExecutionStats(id));

  const metricItems = [
    { icon: '⛔', label: 'Fail', value: stats.failures, background: '#fee2e2', color: '#ef4444' },
    { icon: '📦', label: 'Total', value: stats.total, background: '#dbeafe', color: '#2563eb' },
    { icon: '✅', label: 'Success', value: stats.successes, background: '#dcfce7', color: '#16a34a' },
    { icon: '⏳', label: 'Pending', value: stats.pending, background: '#fef3c7', color: '#f59e0b' },
  ];

  return (
    <div
      style={{
        minWidth: 220,
        borderRadius: 16,
        border: selected ? `3px solid ${accentColor}` : `1px solid ${accentColor}`,
        background: '#fff',
        boxShadow: selected
          ? '0 0 0 4px rgba(37, 99, 235, 0.2), 0 8px 24px rgba(15, 23, 42, 0.12)'
          : '0 8px 24px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: accentColor }} />
      <div style={{ padding: 14, borderTop: `5px solid ${accentColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <strong>{data.label || title}</strong>
          <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 }}>{kind}</span>
        </div>
        {data.description ? <div style={{ marginTop: 6, color: '#64748b', fontSize: 13 }}>{data.description}</div> : null}
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
          {metricItems.map((item) => (
            <div key={item.label} style={{ borderRadius: 8, padding: '6px 8px', background: item.background }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: item.color, fontSize: 12 }}>
                <span>{item.icon}</span>
                <strong style={{ color: '#0f172a', fontSize: 13 }}>{item.value}</strong>
              </div>
              <div style={{ marginTop: 2, fontSize: 11, color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
        {children}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: accentColor }} />
    </div>
  );
}
