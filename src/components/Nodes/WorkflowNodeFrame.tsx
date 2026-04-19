import type { ReactNode } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { WorkflowNodeData, WorkflowNodeType } from '../../types/workflow';

interface WorkflowNodeFrameProps extends NodeProps<WorkflowNodeData> {
  title: string;
  accentColor: string;
  kind: WorkflowNodeType;
  children?: ReactNode;
}

export function WorkflowNodeFrame({ data, selected, title, accentColor, kind, children }: WorkflowNodeFrameProps) {
  return (
    <div
      style={{
        minWidth: 180,
        borderRadius: 16,
        border: selected ? `2px solid ${accentColor}` : '1px solid #d1d5db',
        background: '#fff',
        boxShadow: selected ? `0 0 0 4px ${accentColor}22` : '0 8px 24px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: accentColor }} />
      <div style={{ padding: 14, borderTop: `5px solid ${accentColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <strong>{title}</strong>
          <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 }}>{kind}</span>
        </div>
        <div style={{ marginTop: 8, color: '#0f172a' }}>{data.label}</div>
        {data.description ? <div style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>{data.description}</div> : null}
        {children}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: accentColor }} />
    </div>
  );
}
