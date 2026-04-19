import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function StartNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isStartNode = selected?.type === 'start';
  const [label, setLabel] = useState(isStartNode ? selected.data.label : 'Start');
  const [description, setDescription] = useState(isStartNode ? selected.data.description ?? '' : '');

  return (
    <NodeFormPanel
      title="Start node"
      subtitle="Configure the starting step of the workflow"
      hasSelection={Boolean(isStartNode)}
      validationErrors={isStartNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isStartNode) return;
        updateNode(selected.id, 'start', { label, description: description || undefined, trigger: selected.data.trigger ?? 'manual' });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isStartNode) return;
        setLabel('Start');
        setDescription('');
        updateNode(selected.id, 'start', { label: 'Start', description: undefined, trigger: 'manual' });
      }}
      onDelete={() => selected && isStartNode && deleteNode(selected.id)}
    >
      <ControlledField label="Label" value={label} onChange={setLabel} />
      <ControlledField label="Description" value={description} onChange={setDescription} placeholder="Optional" />
    </NodeFormPanel>
  );
}
