import { useState } from 'react';

export function useNodeSelection<T extends string>() {
  const [selectedNodeId, setSelectedNodeId] = useState<T | null>(null);

  return { selectedNodeId, setSelectedNodeId };
}
