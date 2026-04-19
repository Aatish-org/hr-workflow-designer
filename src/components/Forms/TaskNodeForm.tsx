import { useState } from 'react';
import { ControlledField } from './ControlledField';
import { NodeFormPanel } from './NodeFormPanel';
import { useWorkflowStore } from '../../stores/workflowStore';

export function TaskNodeForm() {
  const { getSelectedNode, updateNode, deleteNode, validationErrors, validateWorkflow } = useWorkflowStore();
  const selected = getSelectedNode();
  const isTaskNode = selected?.type === 'task';
  const [label, setLabel] = useState(isTaskNode ? selected.data.label : 'Task');
  const [description, setDescription] = useState(isTaskNode ? selected.data.description ?? '' : '');
  const [labelError, setLabelError] = useState<string | undefined>();

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (value.trim()) {
      setLabelError(undefined);
    }
  };

  return (
    <NodeFormPanel
      title="Task node"
      subtitle="Edit the task title and description"
      nodeType={selected?.type}
      nodeId={selected?.id}
      hasSelection={Boolean(isTaskNode)}
      validationErrors={isTaskNode ? validationErrors : []}
      onSubmit={() => {
        if (!selected || !isTaskNode) return;
        if (!label.trim()) {
          setLabelError('Label is required');
          return;
        }
        updateNode(selected.id, 'task', { label, description: description || undefined, assignee: selected.data.assignee ?? 'HR' });
        validateWorkflow();
      }}
      onReset={() => {
        if (!selected || !isTaskNode) return;
        setLabel('Task');
        setDescription('');
        setLabelError(undefined);
        updateNode(selected.id, 'task', { label: 'Task', description: undefined, assignee: 'HR' });
      }}
      onDelete={() => selected && isTaskNode && deleteNode(selected.id)}
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
