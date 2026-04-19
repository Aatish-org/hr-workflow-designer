import type { DragEvent } from 'react';
import type { WorkflowNodeType } from '../../types/workflow';

const palette: Array<{ type: WorkflowNodeType; label: string; description: string; color: string }> = [
  { type: 'start', label: 'Start', description: 'Begin the workflow', color: '#0284c7' },
  { type: 'task', label: 'Task', description: 'Manual work item', color: '#16a34a' },
  { type: 'approval', label: 'Approval', description: 'Human approval step', color: '#d97706' },
  { type: 'automatedStep', label: 'Automated Step', description: 'System action', color: '#7c3aed' },
  { type: 'end', label: 'End', description: 'Close the workflow', color: '#dc2626' },
];

interface NodeSidebarProps {
  onDragStart: (event: DragEvent<HTMLButtonElement>, nodeType: WorkflowNodeType) => void;
}

export function NodeSidebar({ onDragStart }: NodeSidebarProps) {
  return (
    <aside style={{ width: 280, padding: 16, borderRight: '1px solid #e5e7eb', background: '#f8fafc' }}>
      <h2 style={{ marginTop: 0 }}>Nodes</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Drag a node onto the canvas to create it.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {palette.map((item) => (
          <button
            key={item.type}
            type="button"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
            style={{
              textAlign: 'left',
              border: `1px solid ${item.color}33`,
              borderLeft: `6px solid ${item.color}`,
              borderRadius: 14,
              padding: 12,
              background: '#fff',
              cursor: 'grab',
            }}
          >
            <div style={{ fontWeight: 700 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{item.description}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}
