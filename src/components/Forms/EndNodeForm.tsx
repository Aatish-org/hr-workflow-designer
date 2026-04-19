import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function EndNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isEndNode = selected?.type === 'end';
  const [label, setLabel] = useState(isEndNode ? selected.data.label : 'End');
  const [description, setDescription] = useState(isEndNode ? selected.data.description ?? '' : '');

  return (
    <NodeFormPanel
      title="End node"
      subtitle="Finalize the workflow exit step"
      nodeType={selected?.type}
      nodeId={selected?.id}
      hasSelection={Boolean(isEndNode)}
      validationErrors={isEndNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isEndNode) return;
        updateNode(selected.id, 'end', {
          label,
          description: description || undefined,
          outcome: selected.data.outcome ?? 'complete',
        });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isEndNode) return;
        setLabel('End');
        setDescription('');
        updateNode(selected.id, 'end', {
          label: 'End',
          description: undefined,
          outcome: 'complete',
        });
      }}
      onDelete={() => selected && isEndNode && deleteNode(selected.id)}
    >
      <ControlledField label="Label" value={label} onChange={setLabel} />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
