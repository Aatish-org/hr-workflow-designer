import type { ReactNode } from 'react';

interface MetricsCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  value?: string;
}

export function MetricsCard({ icon, title, description, value }: MetricsCardProps) {
  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
        <strong style={{ color: '#0f172a', fontSize: 14 }}>{title}</strong>
      </div>
      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 12 }}>{description}</p>
      {value ? <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700, color: '#2563eb' }}>{value}</div> : null}
    </article>
  );
}
