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
}

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
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
}: NodeFormPanelProps) {
  return (
    <section style={{ border: '1px solid #dbe4ee', borderRadius: 16, padding: 16, background: '#fff', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
      <div style={{ display: 'grid', gap: 4, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {subtitle ? <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{subtitle}</p> : null}
      </div>
      {!hasSelection ? <p style={{ color: '#64748b', fontSize: 14 }}>Select a node on the canvas to edit it.</p> : <div style={{ display: 'grid', gap: 12 }}>{children}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button type="button" onClick={onSubmit} disabled={!hasSelection} style={{ ...actionButtonStyle, borderColor: '#2563eb', background: hasSelection ? '#dbeafe' : '#f8fafc' }}>
          {submitLabel}
        </button>
        <button type="button" onClick={onReset} disabled={!hasSelection} style={actionButtonStyle}>
          {resetLabel}
        </button>
        <button type="button" onClick={onDelete} disabled={!hasSelection} style={{ ...actionButtonStyle, borderColor: '#ef4444', background: hasSelection ? '#fee2e2' : '#f8fafc' }}>
          {deleteLabel}
        </button>
      </div>
    </section>
  );
}
