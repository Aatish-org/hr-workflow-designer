import { useState } from 'react';
import { LoadingButton } from '../components/common/LoadingButton';

/**
 * Example showing how to use LoadingButton with async operations
 */
export function LoadingButtonExample() {
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [isLoadingAutomations, setIsLoadingAutomations] = useState(false);

  // Example: Simulate API call for running simulation
  const handleRunSimulation = async () => {
    setIsRunningSimulation(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Simulation completed');
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // Example: Simulate API call for loading automations
  const handleLoadAutomations = async () => {
    setIsLoadingAutomations(true);
    try {
      // Simulate API call
      const response = await fetch('/api/automations');
      const data = await response.json();
      console.log('Automations loaded:', data);
    } catch (error) {
      console.error('Failed to load automations:', error);
    } finally {
      setIsLoadingAutomations(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, padding: 20 }}>
      {/* Primary button with loading state */}
      <LoadingButton
        variant="primary"
        loading={isRunningSimulation}
        loadingText="Running simulation..."
        onClick={handleRunSimulation}
      >
        Run simulation
      </LoadingButton>

      {/* Secondary button with loading state */}
      <LoadingButton
        variant="secondary"
        loading={isLoadingAutomations}
        loadingText="Loading..."
        onClick={handleLoadAutomations}
      >
        Load automations
      </LoadingButton>

      {/* Danger button example */}
      <LoadingButton
        variant="danger"
        loading={false}
        onClick={() => console.log('Delete clicked')}
      >
        Delete workflow
      </LoadingButton>

      {/* Disabled button example */}
      <LoadingButton
        variant="primary"
        disabled={true}
        onClick={() => console.log('This will not fire')}
      >
        Disabled button
      </LoadingButton>
    </div>
  );
}

/**
 * Alternative: Using spinner in existing inline-styled buttons
 */
export function InlineLoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      style={{
        height: 40,
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: isLoading ? '#1d4ed8' : '#2563eb',
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {isLoading && (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          style={{ animation: 'spin 0.8s linear infinite' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="32 32"
            opacity="0.25"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="32 32"
            strokeDashoffset="8"
          />
        </svg>
      )}
      {isLoading ? 'Loading...' : 'Click me'}
    </button>
  );
}
