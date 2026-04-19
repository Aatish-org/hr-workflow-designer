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
  const [labelError, setLabelError] = useState<string | undefined>();

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (value.trim()) {
      setLabelError(undefined);
    }
  };

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
        if (!label.trim()) {
          setLabelError('Label is required');
          return;
        }
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
        setLabelError(undefined);
        updateNode(selected.id, 'end', {
          label: 'End',
          description: undefined,
          outcome: 'complete',
        });
      }}
      onDelete={() => selected && isEndNode && deleteNode(selected.id)}
    >
      <ControlledField
        label="Label"
        value={label}
        onChange={handleLabelChange}
        error={labelError}
        onBlur={() => setLabelError(label.trim() ? undefined : 'Label is required')}
      />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
