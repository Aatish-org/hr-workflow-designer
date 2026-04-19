import type { WorkflowOverviewCard } from '../../types/metrics';

interface WorkflowMetricsCardProps {
  workflow: WorkflowOverviewCard;
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ borderRadius: 8, padding: '8px 10px', background: color }}>
      <div style={{ fontSize: 12, color: '#334155' }}>{label}</div>
      <strong style={{ display: 'block', marginTop: 2, color: '#0f172a' }}>{value}</strong>
    </div>
  );
}

export function WorkflowMetricsCard({ workflow }: WorkflowMetricsCardProps) {
  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff', display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <strong style={{ color: '#0f172a', fontSize: 14 }}>🔄 {workflow.title}</strong>
        <span style={{ fontSize: 11, color: '#64748b' }}>{workflow.triggeredBy}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        <StatPill label="Task" value={workflow.metrics.tasks} color="#dbeafe" />
        <StatPill label="Exec" value={workflow.metrics.executions} color="#fef3c7" />
        <StatPill label="Done" value={workflow.metrics.completed} color="#dcfce7" />
      </div>
    </article>
  );
}
