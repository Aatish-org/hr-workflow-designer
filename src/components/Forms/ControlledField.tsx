import { useId } from 'react';

interface ControlledFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
}

export function ControlledField({ label, value, onChange, placeholder, type = 'text' }: ControlledFieldProps) {
  const id = useId();

  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: 10,
          padding: '10px 12px',
          fontSize: 14,
          outline: 'none',
        }}
      />
    </label>
  );
}
