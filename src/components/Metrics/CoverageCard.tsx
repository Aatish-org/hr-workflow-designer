import type { CoverageMetric } from '../../types/metrics';

interface CoverageCardProps {
  metric: CoverageMetric;
}

export function CoverageCard({ metric }: CoverageCardProps) {
  return (
    <article style={{ borderRadius: 14, border: '1px solid #e5e7eb', background: '#f8fafc', padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <strong style={{ color: '#0f172a', fontSize: 14 }}>{metric.title}</strong>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12 }}>{metric.description}</p>
        </div>
        <span style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>{metric.percentage}%</span>
      </div>
      <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ width: `${metric.percentage}%`, height: '100%', background: '#16a34a' }} />
      </div>
    </article>
  );
}
