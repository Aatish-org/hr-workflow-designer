import { type CSSProperties, type ReactNode } from 'react';
import { Spinner } from './Spinner';

interface LoadingButtonProps {
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  style?: CSSProperties;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<string, CSSProperties> = {
  primary: {
    background: '#2563eb',
    color: '#fff',
  },
  secondary: {
    background: '#6b7280',
    color: '#fff',
  },
  danger: {
    background: '#ef4444',
    color: '#fff',
  },
};

const baseButtonStyle: CSSProperties = {
  height: 40,
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s, opacity 0.2s',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
};

const disabledStyle: CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

export function LoadingButton({
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  children,
  style,
  variant = 'primary',
  type = 'button',
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : children;

  const handleClick = async () => {
    if (!onClick || isDisabled) return;
    await onClick();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      style={{
        ...baseButtonStyle,
        ...variantStyles[variant],
        ...(isDisabled ? disabledStyle : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        const hoverColors: Record<string, string> = {
          primary: '#1d4ed8',
          secondary: '#4b5563',
          danger: '#dc2626',
        };
        e.currentTarget.style.background = hoverColors[variant];
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.background = variantStyles[variant].background as string;
      }}
    >
      {loading && <Spinner size={16} color="#fff" />}
      {displayText}
    </button>
  );
}
