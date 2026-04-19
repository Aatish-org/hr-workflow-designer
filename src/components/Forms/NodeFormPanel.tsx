interface NodeFormPanelProps {
  title: string;
  subtitle?: string;
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

export function NodeFormPanel({
  title,
  subtitle,
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
  return (
    <section style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderLeft: '1px solid #e5e7eb'
    }}>
      <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>Node Configuration</h3>
        {subtitle ? <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>{subtitle}</p> : null}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
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

      <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
