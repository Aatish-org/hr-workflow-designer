import { useId } from 'react';

interface ControlledFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  error?: string;
  onBlur?: () => void;
}

export function ControlledField({ label, value, onChange, placeholder, type = 'text', error, onBlur }: ControlledFieldProps) {
  const id = useId();
  const defaultBorderColor = error ? '#ef4444' : '#e5e7eb';

  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{
          background: '#fff',
          border: `1px solid ${defaultBorderColor}`,
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2563eb';
          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = defaultBorderColor;
          e.target.style.boxShadow = 'none';
          onBlur?.();
        }}
      />
      {error ? <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span> : null}
    </label>
  );
}
