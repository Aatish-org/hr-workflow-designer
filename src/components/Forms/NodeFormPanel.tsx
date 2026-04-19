interface NodeFormPanelProps {
  title: string;
  subtitle?: string;
  nodeType?: string;
  nodeId?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  deleteLabel?: string;
  hasSelection?: boolean;
  validationErrors?: string[];
}

const baseButtonStyle: React.CSSProperties = {
  height: 40,
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  fontSize: 14,
  fontWeight: 500,
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.15s, opacity 0.15s',
};

const saveButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: '#2563eb',
};

const resetButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: '#6b7280',
};

const deleteButtonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  background: '#ef4444',
};

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

// Node type color mapping
const nodeTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  start: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  task: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  approval: { bg: '#fed7aa', text: '#92400e', border: '#fdba74' },
  automatedStep: { bg: '#e9d5ff', text: '#6b21a8', border: '#d8b4fe' },
  end: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

// Node type display names
const nodeTypeLabels: Record<string, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automatedStep: 'Automated Step',
  end: 'End',
};

export function NodeFormPanel({
  title,
  subtitle,
  nodeType,
  nodeId,
  children,
  onSubmit,
  onReset,
  onDelete,
  submitLabel = 'Save changes',
  resetLabel = 'Reset',
  deleteLabel = 'Delete node',
  hasSelection = true,
  validationErrors = [],
}: NodeFormPanelProps) {
  const colors = nodeType ? nodeTypeColors[nodeType] : null;
  const typeLabel = nodeType ? nodeTypeLabels[nodeType] : null;

  return (
    <section style={{
      display: 'grid',
      gap: 16,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
          Node Configuration
        </h3>
        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
          {title}
        </p>
        {nodeType && typeLabel && colors && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              {typeLabel}
            </span>
            {nodeId && (
              <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>
                #{nodeId}
              </span>
            )}
          </div>
        )}
        {subtitle ? <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>{subtitle}</p> : null}
      </div>

      <div>
        {!hasSelection ? (
          <p style={{ color: '#6b7280', fontSize: 14 }}>Select a node on the canvas to edit it.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {children}
            {validationErrors.length > 0 ? (
              <div style={{ borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2', padding: 12 }}>
                <strong style={{ color: '#b91c1c' }}>Validation errors</strong>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: '#7f1d1d' }}>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!hasSelection}
          style={{ ...saveButtonStyle, ...(hasSelection ? {} : disabledButtonStyle) }}
          onMouseEnter={(e) => hasSelection && (e.currentTarget.style.background = '#1d4ed8')}
          onMouseLeave={(e) => hasSelection && (e.currentTarget.style.background = '#2563eb')}
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasSelection}
          style={{ ...resetButtonStyle, ...(hasSelection ? {} : disabledButtonStyle) }}
          onMouseEnter={(e) => hasSelection && (e.currentTarget.style.background = '#4b5563')}
          onMouseLeave={(e) => hasSelection && (e.currentTarget.style.background = '#6b7280')}
        >
          {resetLabel}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!hasSelection}
          style={{ ...deleteButtonStyle, ...(hasSelection ? {} : disabledButtonStyle) }}
          onMouseEnter={(e) => hasSelection && (e.currentTarget.style.background = '#dc2626')}
          onMouseLeave={(e) => hasSelection && (e.currentTarget.style.background = '#ef4444')}
        >
          {deleteLabel}
        </button>
      </div>
    </section>
  );
}
