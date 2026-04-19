import { useMemo, useState } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { CoverageCard } from './CoverageCard';
import { MetricsCard } from './MetricsCard';
import { WorkflowMetricsCard } from './WorkflowMetricsCard';

export function PerformanceMetricsPanel() {
  const [query, setQuery] = useState('');
  const workflowMetrics = useWorkflowStore((state) => state.workflowMetrics);

  const filteredInsights = useMemo(() => {
    if (!query.trim()) return workflowMetrics.insightMetrics;
    const normalized = query.toLowerCase();
    return workflowMetrics.insightMetrics.filter((metric) =>
      `${metric.title} ${metric.description}`.toLowerCase().includes(normalized),
    );
  }, [query, workflowMetrics.insightMetrics]);

  return (
    <section style={{ display: 'grid', gap: 12, padding: 14, background: '#f8fafc' }}>
      <header style={{ borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', padding: 12 }}>
        <strong style={{ color: '#0f172a' }}>Performance Overview</strong>
        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12 }}>Real-time workflow performance insights</p>
      </header>

      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', padding: 12, display: 'grid', gap: 10 }}>
        <strong style={{ color: '#0f172a', fontSize: 14 }}>📊 Insight Metrics</strong>
        <input
          type="search"
          placeholder="Search Here..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'grid', gap: 8 }}>
          {filteredInsights.map((metric) => (
            <MetricsCard
              key={metric.id}
              icon={metric.icon}
              title={metric.title}
              description={metric.description}
              value={metric.value}
            />
          ))}
        </div>
      </div>

      <CoverageCard metric={workflowMetrics.coverage} />

      <div style={{ display: 'grid', gap: 10 }}>
        {workflowMetrics.workflows.map((workflow) => (
          <WorkflowMetricsCard key={workflow.id} workflow={workflow} />
        ))}
      </div>

      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', padding: 12, display: 'grid', gap: 8 }}>
        <strong style={{ color: '#0f172a', fontSize: 14 }}>🎯 Flow Objectives</strong>
        {workflowMetrics.flowObjectives.map((metric) => (
          <MetricsCard
            key={metric.id}
            icon={metric.icon}
            title={metric.title}
            description={metric.description}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}
