import type { DragEvent } from 'react';
import type { WorkflowNodeType } from '../../types/workflow';

const palette: Array<{ type: WorkflowNodeType; label: string; description: string; color: string; tooltip: string }> = [
  { type: 'start', label: 'Start', description: 'Begin the workflow', color: '#0284c7', tooltip: 'Start node: entry point of workflow' },
  { type: 'task', label: 'Task', description: 'Manual work item', color: '#16a34a', tooltip: 'Task node: manual work assignment' },
  { type: 'approval', label: 'Approval', description: 'Human approval step', color: '#d97706', tooltip: 'Approval node: manager/HR approval gate' },
  { type: 'automatedStep', label: 'Automated Step', description: 'System action', color: '#7c3aed', tooltip: 'Automated step: system-triggered actions' },
  { type: 'end', label: 'End', description: 'Close the workflow', color: '#dc2626', tooltip: 'End node: workflow completion' },
];

interface NodeSidebarProps {
  onDragStart: (event: DragEvent<HTMLButtonElement>, nodeType: WorkflowNodeType) => void;
}

export function NodeSidebar({ onDragStart }: NodeSidebarProps) {
  return (
    <aside style={{
      width: '100%',
      height: '100%',
      padding: 16,
      background: '#f9fafb',
      overflowY: 'auto'
    }}>
      <h2 style={{
        marginTop: 0,
        fontSize: 18,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 8
      }}>
        Workflow Nodes
      </h2>
      <p style={{
        color: '#6b7280',
        fontSize: 13,
        marginBottom: 16,
        lineHeight: 1.5
      }}>
        Drag a node onto the canvas to create it.
      </p>
      <div style={{ display: 'grid', gap: 12 }}>
        {palette.map((item) => (
          <button
            key={item.type}
            type="button"
            title={item.tooltip}
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
            style={{
              textAlign: 'left',
              border: `2px solid ${item.color}22`,
              borderLeft: `5px solid ${item.color}`,
              borderRadius: 12,
              padding: '12px 14px',
              background: '#fff',
              cursor: 'grab',
              minHeight: 50,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 4,
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${item.color}08`;
              e.currentTarget.style.borderColor = `${item.color}44`;
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = `${item.color}22`;
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
          >
            <div style={{
              fontWeight: 600,
              fontSize: 14,
              color: '#111827',
              letterSpacing: '-0.01em'
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: 12,
              color: '#6b7280',
              lineHeight: 1.4
            }}>
              {item.description}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
